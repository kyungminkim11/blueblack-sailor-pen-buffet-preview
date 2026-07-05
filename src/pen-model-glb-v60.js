import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { parts } from './data.js';

const GROUP_KEYS={
  cap_end:'capEndGroup',
  cap_body:'capBodyGroup',
  nib_grip:'nibGripGroup',
  barrel_body:'barrelGroup',
  barrel_end:'barrelEndGroup'
};

function normalized(value=''){return String(value).trim().toLowerCase();}
function candidates(part){return [part.meshName,part.canonicalId,part.legacyMeshName,part.id].filter(Boolean).map(normalized);}
function findNamedObject(scene,part){
  const names=new Set(candidates(part));
  let exact=null;
  scene.traverse(object=>{if(!exact&&names.has(normalized(object.name)))exact=object;});
  return exact;
}
function cloneMaterials(object){
  object.traverse(node=>{
    if(!node.isMesh)return;
    if(Array.isArray(node.material))node.material=node.material.map(material=>material?.clone?.()??material);
    else if(node.material?.clone)node.material=node.material.clone();
    node.castShadow=true;node.receiveShadow=true;
  });
}
function wrapForOffset(node,partId){
  const parent=node.parent;
  if(!parent)return node;
  const base=new THREE.Group();base.name=`${partId}_glb_base`;
  const offset=new THREE.Group();offset.name=`${partId}_glb_offset`;
  base.position.copy(node.position);base.quaternion.copy(node.quaternion);base.scale.copy(node.scale);
  node.position.set(0,0,0);node.quaternion.identity();node.scale.set(1,1,1);
  const index=parent.children.indexOf(node);parent.remove(node);base.add(offset);offset.add(node);
  parent.add(base);
  if(index>=0){parent.children.splice(parent.children.indexOf(base),1);parent.children.splice(index,0,base);}
  return offset;
}
function loadGlb(url){
  return new Promise((resolve,reject)=>new GLTFLoader().load(url,resolve,undefined,reject));
}

export async function upgradePenModelFromGlb({model,url=new URL('../models/sailor-pen-buffet.glb',import.meta.url).href}={}){
  if(!model?.root||!model?.partMeshes||!model?.groups)return false;
  try{
    const gltf=await loadGlb(url);
    const source=gltf.scene;
    source.updateMatrixWorld(true);
    const found=new Map();
    for(const part of parts){
      const object=findNamedObject(source,part);
      if(!object)throw new Error(`Missing GLB node: ${part.meshName||part.canonicalId||part.id}`);
      found.set(part.id,object);
    }
    for(const object of found.values())cloneMaterials(object);
    const offsets=new Map();
    for(const part of parts){
      const object=found.get(part.id);
      const offset=wrapForOffset(object,part.id);
      offsets.set(part.id,offset);
      model.partMeshes.set(part.id,[]);
      object.traverse(node=>{
        if(!node.isMesh)return;
        node.userData.partId=part.id;
        model.partMeshes.get(part.id).push(node);
      });
    }
    Object.entries(GROUP_KEYS).forEach(([partId,key])=>{if(offsets.get(partId))model.groups[key]=offsets.get(partId);});
    model.root.clear();
    model.root.position.set(0,0,0);model.root.rotation.set(0,0,0);model.root.scale.set(1,1,1);
    model.root.add(source);
    model.root.userData.modelSource='glb';
    window.dispatchEvent(new CustomEvent('penmodelupgraded',{detail:{source:'glb',url}}));
    return true;
  }catch(error){
    console.info('GLB model unavailable; using procedural pen model.',error?.message||error);
    model.root.userData.modelSource='procedural';
    return false;
  }
}
