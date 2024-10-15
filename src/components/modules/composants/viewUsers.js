import { useParams } from "react-router-dom";
import ContentSection from "../Content";

function ViewsUser(){
    const {userId} = useParams();

    console.log(userId);
    return (
        <>
            <ContentSection ulShownav={"cores"} navactive={"comptes"}>
                <div class="container-fluid">
                    <div class="col-xxl-12 col-12">
                        <div class="card mt-5 mt-xxl-0">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h4 class="mb-0">Order Summary</h4>
                            <a href="#!" class="btn btn-primary btn-sm">Edit Cart</a>
                        </div>
                        <div class="card-body">


                            <div class="d-md-flex">
                            <div>
                                <img src="/../assets/images/ecommerce/product-1.jpg" alt="Image" class="img-4by3-md rounded" />
                            </div>
                            <div class="ms-md-4 mt-2">
                                <h4 class="mb-1 ">
                                <a href="#!" class="text-inherit">
                                    Women Shoes
                                </a>
                                </h4>
                                <h5>$49.00</h5>



                            </div>

                            </div>
                            {/* <hr class="my-3"/> */}

                        </div>
                        <div class="card-body border-top pt-2">
                            <ul class="list-group list-group-flush mb-0 ">
                            <li class="d-flex justify-content-between list-group-item px-0">
                                <span>Subtotal</span>
                                <span class="text-dark ">$128.00</span>
                            </li>
                            <li class="d-flex justify-content-between list-group-item px-0">
                                <span>Shipping</span>
                                <span class="text-dark ">$0.00</span>
                            </li>
                            <li class="d-flex justify-content-between list-group-item px-0">
                                <span>Discount</span>
                                <span class="text-dark ">$0.00</span>
                            </li>
                            <li class="d-flex justify-content-between list-group-item px-0 pb-0">
                                <span>Tax</span>
                                <span class="text-dark ">$0.00</span>
                            </li>

                            </ul>
                        </div>
                        <div class="card-footer">
                            <div class="d-flex justify-content-between list-group-item px-0 pb-0">
                            <span class="fs-4  text-dark">Grand Total</span>
                            <span class=" text-dark">$128.00</span>
                            </div>
                        </div>

                        </div>

                    </div>
                </div>
            </ContentSection>
        </>
    );
}

export default ViewsUser;