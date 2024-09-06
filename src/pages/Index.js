import { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import config from "../config";
import MyModal from "../components/MyModal";


function Index() {
    const [products, setProducts] = useState([]);
    const [carts, setCarts] = useState([]);
    const [recordInCarts, setRecordInCarts] = useState(0);
    const [sumQty, setSumQty] = useState(0);
    const [sumPrice, setSumPrice] = useState(0);

    useEffect(() => {
        fetchData();
        fetchDataFromLocal();
    }, []);

    const fetchData = async () => {
        try{
            const res = await axios.get(config.apiPath + "/product/list");
            if(res.data.results !== undefined){
                setProducts(res.data.results);
            }
        }catch(e){
            Swal.fire({
                title:'error',
                text: e.message,
                icon: 'error',
            });
        }
    }

    const addToCart = async (item) => {
        let arr = carts;

        if (arr === null){
            arr = [];
        }

        arr.push(item);

        setCarts(arr);
        setRecordInCarts(arr.length);

        localStorage.setItem('carts', JSON.stringify(carts));

        fetchDataFromLocal();
    }

    const fetchDataFromLocal = () => {
        const itemInCarts = JSON.parse(localStorage.getItem('carts'));

        if (itemInCarts !== null ){ 
        setCarts(itemInCarts);
        setRecordInCarts(itemInCarts !== null ? itemInCarts.length : 0);

        computerPriceAndQty(itemInCarts);
        }
    }

    const computerPriceAndQty = (itemInCarts) => {
        let sumQty = 0;
        let sumPrice = 0;

        for (let i = 0; i < itemInCarts.length; i++){
            const item = itemInCarts[i];
            sumQty++;
            sumPrice += parseInt(item.price);
        }

        setSumPrice(sumPrice);
        setSumQty(sumQty);
    }

    function showImage(item){
        if (item.img !== undefined){
            let imgPath = config.apiPath + '/uploads/' + item.img;

            if (item.img === "") imgPath = "default_image.webp";
            return <img className="card-img-top" height='150px'src={imgPath} alt="" />
        }

        return <></>
    }

    return<>
        <div className="container mt-3">
            <div className="float-start">
                <div className="h3">สินค้าของร้านเรา</div>
            </div>
            <div className="float-end ">
                ตะกร้าของฉัน
                <button 
                    data-bs-toggle="modal"
                    data-bs-target="#modalCart"
                    className="btn btn-outline-success ms-2 me-2">
                    <i className="fa fa-shopping-cart me-2" ></i>
                    {recordInCarts}
                </button>
                ชิ้น
            </div>

            <div className="row">
                {products.length > 0 ? products.map(item => 
                    <div className="col-3 mt-5" key={item.id}>
                        <div className="card">
                            {showImage(item)}
                            <div className="card-body">
                                <div>{item.name}</div>
                                <div>{item.price.toLocaleString('th-Th')}</div>
                                <div className="text-center">
                                    <button className="btn btn-primary" onClick={e => addToCart(item)}>
                                        <i className="fa fa-shopping-cart me-2"></i>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ): <></>}
            </div>
        </div>
        <MyModal id="modalCart" title="ตะกร้าของฉัน">
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>name</th>
                        <th className="text-end">price</th>
                        <th className="text-end">qty</th>
                        <th width="60px"></th>
                    </tr>
                </thead>
                <tbody>
                    {carts.length > 0 ? carts.map(item => 
                        <tr>
                            <td>{item.name}</td>
                            <td className="text-end">{item.price.toLocaleString('th-Th')}</td>
                            <td className="text-end">1</td>
                            <td className="text-center">
                                <button className="btn btn-danger" >
                                    <i className="fa fa-times"></i>
                                </button>
                            </td>
                        </tr>
                    ): <></>}
                </tbody>
            </table>
            <div className="text-center">
                จำนวน {sumQty.toLocaleString('th-Th')} รายการ เป็นเงิน {sumPrice.toLocaleString('th-Th')} บาท 
            </div>

            <div className="mt-3">
                <div className="alert alert-info">
                    <div>โปรดโอนไปยังบัญชี</div>
                    <div>กสิกร นายลอง ทดสอบ 999-999-9999</div>
                </div>
                <div>
                    <div>ชื่อผู้ซื้อ</div>
                    <input className="form-control" />
                </div>
                <div className="mt-3">
                    <div>เบอร์โทรติดต่อ</div>
                    <input className="form-control" />
                </div>
                <div className="mt-3">
                    <div>ที่อยู่จัดส่ง</div>
                    <input className="form-control" />
                </div>
                <div className="mt-3">
                    <div>วันที่โอน</div>
                    <input className="form-control" type="date" />
                </div>
                <div className="mt-3">
                    <div>เวลาที่โอนเงิน</div>
                    <input className="form-control" type="time" />
                </div>
                <button className="btn btn-primary mt-3"> 
                    <i className="fa fa-check me-2"></i>ยืนยันการซื้อ
                </button>
            </div>

            
        </MyModal>
    </>
}

export default Index;