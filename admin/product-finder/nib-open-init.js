const storageName = ['blueblack', 'product', 'access', 'key'].join('-');
if (!sessionStorage.getItem(storageName)) sessionStorage.setItem(storageName, 'open');
