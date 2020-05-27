var i = 0;
var isEssential = false;

class ShopItem {
    constructor(id, name, isEssential) {
        this.id = id;
        this.name = name;
        this.isEssential = isEssential;
    }
}

class Storage {
    static getItems() {
        let items;
        if (localStorage.getItem('items') === null) {
            items = [];
        } else {
            items = JSON.parse(localStorage.getItem('items'));
        }
        return items;
    }

    static displayItems() {
        readFile(items => {
            items = JSON.parse(items);
            items.forEach(item => {
                document.querySelector('#need').innerHTML += `<div class="expandable-content" background-color: ${item.isEssential ? 'lightgreen' : 'lightblue'}; class='btn' id='item${i++}'> <div class='left' width='20%'> <ons-icon icon="fa-cart-arrow-down" class="list-item__icon"></ons-icon>
                </div>  <div class='center' width='60%'> - ${item.name} </div> <div class='right'> <ons-button data-id="${item.id}" id='btnDelete' width='20%' style='background-color: red;'> Delete </ons-button> </div> </div>`;
            });
        })

    }

    static addItem(item) {
        let items = Storage.getItems();
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
        try {
            writeFile(JSON.stringify(items));
            ons.notification.toast(item.name + ' added to the list!', { timeout: 2000 });
        } catch (er) {
            alert(er + "write");
        }
    }

    static deleteItem(element) {
        if (element.id === 'btnDelete') {
            const id = element.getAttribute('data-id');
            const items = Storage.getItems();
            let name;

            items.forEach((item, index) => {
                if (item.id == id) {
                    name = item.name;
                    items.splice(index, 1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
            writeFile(JSON.stringify(items));
            ons.notification.toast(name + ' deleted from the list!', { timeout: 2000 });
        }
    }
}

document.addEventListener('deviceready', Storage.displayItems)


$(function() {
    const toolBar = document.querySelector('.center');
    toolBar.innerHTML = 'Shopping List';

    const floatingActionButton = document.querySelector('.addNewItem');
    const needList = document.querySelector('#need');

    floatingActionButton.onclick = function() {
        document.querySelector('#myNavigator').pushPage('page2.html');
    }

    document.addEventListener('init', function(event) {
        const saveButtonSecondPage = document.querySelector('#save');

        var page = event.target;
        if (page.id == 'page2') {
            isEssential = document.querySelector('.switch').addEventListener('change', essentialProduct);
            saveButtonSecondPage.onclick = function() {
                name = document.querySelector('#name').value;
                ons.notification.confirm('Are you sure to add?')
                    .then((response) => {
                        if (response) {
                            let id = Date.now()
                            document.querySelector('#need').innerHTML += `<ons-list-item  style='margin-top: 1.5px;background-color: ${isEssential ? 'lightgreen' : 'lightblue'}; class='btn' id='item${i++}'> <div class='left' width='20%'><ons-icon icon="fa-cart-arrow-down" class="list-item__icon"></ons-icon> </div>  <div class='center' width='60%'> - ${name} </div> <div class='right'> <ons-button data-id='${id}' id='btnDelete' width='20%' style='background-color: red;'> Delete </ons-button> </div> </ons-list-item>`;
                            var item = new ShopItem(id, name, isEssential);
                            Storage.addItem(item);
                        }
                    });
            }
        }

    });
    needList.addEventListener('click', deleteItem);
});


function deleteItem(e) {
    if (e.target.id === 'btnDelete') {
        ons.notification.confirm('Are you sure to delete?').then((response) => {
            if (response) {
                Storage.deleteItem(e.target);
                e.target.parentElement.parentElement.remove();
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