var i = 0;
var nnnn;
var isEssential = false;

class ShopItem {
    constructor(id, name, quantity = 1, isEssential) {
        this.id = id;
        this.name = name;
        this.isEssential = isEssential;
        this.quantity = quantity;
    }
}

class ListItem {
    constructor(id, name, list) {
        this.id = id;
        this.name = name;
        this.list = list;
    }
}

class Storage {
    static getItems() {
        let lists;
        if (localStorage.getItem('lists') === null) {
            lists = {};
        } else {
            lists = JSON.parse(localStorage.getItem('lists'));
        }
        return lists;
    }

    static setLists(nameOfList) {
        let lists = Storage.getItems();
        lists[nameOfList] = [];
        localStorage.setItem('lists', JSON.stringify(lists));
        console.log(lists);
        document.querySelector('#need').innerHTML += `<ons-list-item modifier="longdivider" id="tappableItem" tappable> <div class='left'>${nameOfList}</div> <div class='right'> <ons-row> <ons-col> <ons-button id='openPage2' width='20%' style='background-color: green; margin-right: 2px;'> Add </ons-button> </ons-col> <ons-col> <ons-button id='btnDelete' width='20%' style='background-color: red;'> Delete </ons-button> </ons-row> </ons-col> </div> </ons-list-item>`;
    }

    static displayLists() {
        let lists = Storage.getItems();
        // for (var prop in lists) {
        //     document.querySelector('#need').innerHTML += `<ons-list-item id="tappableItem" style="margin: 20px 0px 20px 0px;" tappable> <div class='left'> ${prop} </div> <div class='right'> <ons-row> <ons-col> <ons-button id='openPage2' width='20%' style='background-color: green; margin-right: 2px;'> Add </ons-button> </ons-col> <ons-col> <ons-button id='btnDelete' width='20%' style='background-color: red;'> Delete </ons-button> </ons-col> </ons-row> </div> </ons-list-item>`;
        // }

        Object.keys(lists).forEach((key) => {
            document.querySelector('#need').innerHTML += `<ons-list-item modifier="longdivider" id="tappableItem" tappable> <div class='left'>${key}</div> <div class='right'> <ons-row> <ons-col> <ons-button id='openPage2' width='20%' style='background-color: green; margin-right: 2px;'> Add </ons-button> </ons-col> <ons-col> <ons-button id='btnDelete' width='20%' style='background-color: red;'> Delete </ons-button> </ons-col> </ons-row> </div> </ons-list-item>`;
        });

    }

    static displayItems(listName) {
        let lists = Storage.getItems();
        document.querySelector('#listName').innerHTML = listName;
        document.querySelector('#shopList').innerHTML = "";
        for (let [key, value] of Object.entries(lists)) {
            if (key == listName) {
                value.forEach(item => {
                    document.querySelector('#shopList').innerHTML == null ? console.log(null) : document.querySelector('#shopList').innerHTML += `<ons-list-item modifier="longdivider" style="background-color: ${item.isEssential ? 'lightgreen' : 'lightblue'};" class='btn' id='item${i++}'> <div class='left' width='20%'> <ons-icon icon="fa-cart-arrow-down" class="list-item__icon"></ons-icon>
                             </div>  <div class='center' width='60%'> - ${item.name} </div> <div class='right'> <ons-row style="margin-right: 10px;"> <div id="qua"> q : ${item.quantity}</div> </ons-row> <ons-row> <ons-button data-id="${item.id}" id='btnDeleteItem' width='20%' style='background-color: red;'> Delete </ons-button>  </ons-row> </div> </ons-list-item>`;
                });
            }
        }


        // readFile(items => {
        //     items = JSON.parse(items);
        //     items.forEach(item => {
        //         document.querySelector('#shopList').innerHTML += `<ons-list-item background-color: ${item.isEssential ? 'lightgreen' : 'lightblue'}; class='btn' id='item${i++}'> <div class='left' width='20%'> <ons-icon icon="fa-cart-arrow-down" class="list-item__icon"></ons-icon>
        //          </div>  <div class='center' width='60%'> - ${item.name} </div> <div class='right'> <ons-button data-id="${item.id}" id='btnDelete' width='20%' style='background-color: red;'> Delete </ons-button> </div> </ons-list-item>`;
        //     });
        // })
    }

    static addItem(listName, item) {
        let lists = Storage.getItems();
        for (let [key, value] of Object.entries(lists)) {
            console.log("key" + key);
            console.log("listName" + listName);
            console.log("trimmed" + listName.trim());
            console.log(key == listName)
            if (key == listName) {
                value.push(item);
            }
        }
        localStorage.setItem('lists', JSON.stringify(lists));
        try {
            //writeFile(JSON.stringify(lists));
            ons.notification.toast(item.name + ' added to the list!', { timeout: 2000 });
        } catch (er) {
            alert(er + "write");
        } finally {
            document.querySelector('#myNavigator').popPage();
        }
    }

    static deleteList(listName) {
        let lists = Storage.getItems();
        for (let key of Object.keys(lists)) {
            if (key == listName) {
                if (delete lists[key]) {
                    console.log("deleted : " + key);
                    localStorage.setItem("lists", JSON.stringify(lists));
                    ons.notification.toast(name + ' deleted from the list!', { timeout: 2000 });
                }
            }
        }
    }
    static deleteItem(target, listName) {
        var items;
        var _key;
        let lists = Storage.getItems();
        console.log("listName :" + listName);
        if (lists.hasOwnProperty(listName)) {
            Object.keys(lists).forEach(key => {
                console.log(key == listName);
                if (key == listName) {
                    console.log(lists[key]);
                    items = lists[key];
                    _key = key;
                }
            });
            let name;
            let id = target.getAttribute('data-id')
            items.forEach((item, index) => {
                if (item.id == id) {
                    name = item.name;
                    if (item.quantity > 1) {
                        items[_key] = new ShopItem(item.id, item.name, --item.quantity, item.isEssential);
                        console.log(items[_key])
                        localStorage.setItem('lists', JSON.stringify(lists));
                        Storage.displayItems(listName);
                    } else {
                        items.splice(index, 1);
                        items[_key] = items;
                        console.log(items[_key])
                        localStorage.setItem('lists', JSON.stringify(lists));
                        // //writeFile(JSON.stringify(lists));
                        Storage.displayItems(listName);
                        ons.notification.toast(name + ' deleted from the list!', { timeout: 2000 });
                    }
                }
            });
        }
    }
}


document.addEventListener('deviceready', Storage.displayLists)

$(function() {

    const toolBar = document.querySelector('.center');
    toolBar.innerHTML = 'Shopping List';

    const floatingActionButton = document.querySelector('.addNewList');
    const needList = document.querySelector('#need');

    needList.addEventListener('click', listFunctions);

    floatingActionButton.onclick = function() {
        document.querySelector('#myNavigator').pushPage('page3_html');
    }

    document.addEventListener('init', function(event) {
        const saveButtonSecondPage = document.querySelector('#save');
        var page = event.target;

        const nameOfList = document.querySelector('#nameOfList');

        if (page.id == 'page2') {
            isEssential = document.querySelector('ons-switch').addEventListener('change', essentialProduct);
            let quantity = document.querySelector('#choose-sel');
            let quantity_value;
            quantity.addEventListener('change', function(e) {
                quantity_value = e.target.value;
            });
            saveButtonSecondPage.onclick = function() {
                name = document.querySelector('#name').value;
                let id = Date.now();
                var item = new ShopItem(id, name, quantity_value, isEssential);
                Storage.addItem(page.data.listName, item);
            }
        }
        if (page.id == 'page3') {
            const saveListButton = document.querySelector('#saveList');

            saveListButton.onclick = function() {
                Storage.setLists(nameOfList.value);
                document.querySelector('#myNavigator').popPage();
            }
        }
        if (page.id == 'page4') {
            const shopList = document.querySelector('#shopList');
            console.log("data :" + page.data.listName);
            Storage.displayItems(page.data.listName);
            nnnn = page.data.listName;
            shopList.addEventListener('click', deleteItem);
        }
    });
});

function listFunctions(e) {
    if (e.target.parentElement.id === 'tappableItem') {
        console.log("tapp")
        let t = e.target.parentElement;
        console.log(t)
        let i = null;
        for (let item of t.childNodes)
            if (item.outerHTML.includes('class="left')) {
                i = item;
                break;
            }
        console.log(i.innerHTML);
        document.querySelector('#myNavigator').pushPage('page4_html', { data: { listName: i.innerHTML } });
    }

    if (e.target.id === 'openPage2') {
        console.log("add")

        let t = e.target.parentElement.parentElement.parentElement.parentElement;
        console.log(t)
        let i = null;
        for (let item of t.childNodes)
            if (item.outerHTML.includes('class="left')) {
                i = item;
                break;
            }
        console.log(i.innerHTML);
        document.querySelector('#myNavigator').pushPage('page2_html', { data: { listName: i.innerHTML } });
    }

    if (e.target.id === 'btnDelete') {
        console.log("dell")
        let t = e.target.parentElement.parentElement.parentElement.parentElement;
        console.log(t)
        let i = null;
        for (let item of t.childNodes)
            if (item.outerHTML.includes('class="left')) {
                i = item;
                break;
            }
        console.log(i.innerHTML);
        ons.notification.confirm('Are you sure to delete list?').then((response) => {
            if (response) {
                Storage.deleteList(i.innerHTML); // giving list name
                e.target.parentElement.parentElement.parentElement.parentElement.remove();
            }
        });
    }
}

function deleteItem(e) {
    if (e.target.id === 'btnDeleteItem') {
        ons.notification.confirm('Are you sure to delete item?').then((response) => {
            if (response) {
                console.log(nnnn);
                console.log(e.target.parentElement.parentElement);
                Storage.deleteItem(e.target, nnnn);
            }
        });
    }
}


function essentialProduct(e) {
    isEssential = e == undefined ? false : e.value;
}

function writeFile(data) {
    window.requestFileSystem(window.PERSISTENT, 0, function(fs) {
        fs.root.getFile("data.json", { create: true, exclusive: false }, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
                fileWriter.onwriteend = function() {
                    document.querySelector('#myNavigator').popPage();
                    // location.reload();
                };
                let b = new Blob([data], { type: 'text/plain' });
                fileWriter.write(b);
            });
        }, function(e) {
            alert(e + "1")
        });

    }, function(e) {
        alert(e + "2")
    });
}

function readFile(readItems) {
    window.requestFileSystem(window.PERSISTENT, 0, function(fs) {
        console.log('file system open: ' + fs.name);
        fs.root.getFile("data.json", { create: false, exclusive: false }, function(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function() {
                    readItems(this.result);
                };
                reader.readAsText(file);
            }, function(e) {
                alert(e + "3")
            });
        })
    })
}