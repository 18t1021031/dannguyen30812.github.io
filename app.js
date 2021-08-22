
//Open and close AddShoe
var openAddShoe = document.querySelector('.add-shoe')
var addShoeBlock = document.querySelector('.addShoe')
var closeAddShoe = document.querySelector('.addShoe-container i.ti-close')

function open() {
    addShoeBlock.classList.add('open');
};

function close() {
    addShoeBlock.classList.remove('open');
}

    openAddShoe.addEventListener('click', open);
    closeAddShoe.addEventListener('click', close);

//formartCash
function formatCash(numb) {
    var str = numb.toString();
    return str.split('').reverse().reduce((prev, next, index) => {
        return ((index % 3) ? next : (next + '.')) + prev
    })
}

//API
var shoeApi = 'http://localhost:3000/shoes';

function start() {
    getShoes(function(shoe) {
        renderShoes(shoe);
    });

    handleCreateForm();
};

start();

//function
function getShoes(callBack) {
    fetch(shoeApi) 
        .then(function(response) {
            return response.json();
        })
        .then(callBack)
}

function createShoe(data,callback) {
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch(shoeApi,options)
        .then(function(response) {
            return response.json();
        })
        .then(callback);        
}


function handleDeleteShoe(id) {
    var r = confirm("Bạn chắc chắn muốn xóa sản phẩm?")
    if(r){

        var options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        }
        fetch(shoeApi + '/' + id, options)
            .then(function(response) {
                return response.json();
            })
            .then(function() {
                getShoes(function(shoe) {
                    renderShoes(shoe);
                });
                alert('Đã xóa sản phẩm!')
                // var shoeItem = document.querySelector('.shoe-item' + id);
                // if(shoeItem) {
                //     shoeItem.remove();
                // }
            });
    }        
}

//Update
function updateShoe(id, data, callback) {
    var options = {
     method: "PUT",
     headers: {
      "Content-Type": "application/json",
     },
     body: JSON.stringify(data),
    };
    fetch(shoeApi + "/" + id, options)
     .then(function (response) {
      return response.json();
     })
     .then(callback);
   }
//
function renderShoes(shoes) {
    var shoesBlock = document.querySelector('#content .lists');

    var htmls = shoes.map(function(shoe){
        var formatDiscount = formatCash(shoe.discount);
        var formatCost = formatCash(shoe.cost);
        return`
                <div class="item shoe-item-${shoe.id}" >
                    <a href=""><img src=${shoe.img} alt="error">
                        <div>${shoe.info}</div>
                    </a>
                    <div class="shoe-discount">${formatDiscount} đ</div>
                    <div class="shoe-cost">${formatCost} đ</div>
                    <button class = "disappear edit" onclick = "handleUpdateShoe(${shoe.id})">Sửa</button>                 
                    <button class = "disappear del" onclick = "handleDeleteShoe(${shoe.id})">Xóa</button>
                </div>
                `
    });
    shoesBlock.innerHTML = htmls.join('')
    
}

function handleCreateForm() {
    var createBtn = document.querySelector('#create');
    createBtn.onclick = function() {
        var img = document.querySelector('input[name="img"]').value;
        var info = document.querySelector('input[name="info"]').value;
        var discount = document.querySelector('input[name="discount"]').value;
        var cost = document.querySelector('input[name="cost"]').value;  
        var amount = document.querySelector('input[name="amount"]').value;   
        
        // console.log(img, info, discount, cost)
        var formData = {
            img: img,
            info: info,
            discount: discount,
            cost: cost,
            amount: amount
        }
        createShoe(formData,function(){
            getShoes(function(shoe) {
                renderShoes(shoe);
            });
            alert('Thêm thành công!')
            var addShoeBlock = document.querySelector('.addShoe');
            addShoeBlock.remove('open');
        })
    }

}

function handleUpdateShoe(idUpdate) {
    //send data to update block
    var blockUpdate = document.querySelector(".updateShoe-body");
    
    getShoes(function(shoes){
        var idShoeUpdate;
        for(var i = 0; i<shoes.length; i++){
            if(shoes[i].id == idUpdate){
                idShoeUpdate = shoes[i];
                break;
            }
        }
        blockUpdate.querySelector('input[name="img"]').value = idShoeUpdate.img;
        blockUpdate.querySelector('input[name="info"]').value = idShoeUpdate.info
        blockUpdate.querySelector('input[name="discount"]').value = idShoeUpdate.discount;
        blockUpdate.querySelector('input[name="cost"]').value = idShoeUpdate.cost;
        blockUpdate.querySelector('input[name="amount"]').value = idShoeUpdate.amount;
    });
    
    //open and close update block
    var updateShoeBlock = document.querySelector('.updateShoe');

    updateShoeBlock.classList.add('open');

    var closeUpdateShoe = document.querySelector('.updateShoe-container i.ti-close')  

    closeUpdateShoe.addEventListener('click', function(){
        updateShoeBlock.classList.remove('open');
    });

    //lấy dữ liệu update
    
    var updateBtn = document.querySelector('#update');
    var updateBlock = document.querySelector('.updateShoe')
    updateBtn.onclick = function() {
        var r = confirm("Bạn chắc chắn muốn cập nhật sản phẩm?")
            if(r){
                var img = updateBlock.querySelector('input[name="img"]').value;
                var info = updateBlock.querySelector('input[name="info"]').value;
                var discount = updateBlock.querySelector('input[name="discount"]').value;
                var cost = updateBlock.querySelector('input[name="cost"]').value;  
                var amount = updateBlock.querySelector('input[name="amount"]').value;   
                
                 //console.log(img, info, discount, cost, amount)
                var formData2 = {
                    img: img,
                    info: info,
                    discount: discount,
                    cost: cost,
                    amount: amount
                }

                //console.log(formData2)
                updateShoe(idUpdate,formData2,function(){
                    getShoes(function(shoe) {
                        renderShoes(shoe);
                    });
                    alert('Cập nhật thành công!');
                    updateBlock.remove('open');
                })
            }
        }
 
}

   //appear and dispappear del button
function appearDel() {
    var dels = document.querySelectorAll('.item button')
    for(var i = 0; i < dels.length; i++){
                var del = dels[i];
                del.classList.toggle('disappear');
            }
}

