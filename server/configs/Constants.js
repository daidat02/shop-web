import {v4 as uuidv4} from "uuid"
const API_PATH = {
    //authentication
    SEND_OTP:"/otp/send-otp",
    CHECK_OTP:"/otp/check-otp",
    REG_ACC: "/auth/reg",
    LOGIN: "/auth/login",
    LOGIN_ADMIN:"/auth/admin/login",
    REFRESH_TOKEN:"/auth/refresh",
    LOGOUT:'/auth/logout',
    //category
    GET_CAT:"/cat/get",
    CREATE_CAT: "/cat/create",
    DELETE_CAT:"/cat/:categoryId",
    //product
    GET_PROD:"/prod/get",
    GET_PROD_CAT_ID:"/prod/:categoryId",
    CREATE_PROD:"/prod/create",
    DELETE_PRODUCT:"/prod/:productId",
    REMOVE_PRODUCT:"/remove/:productId",
    GET_PROD_DETAIL:"/prod-detail/:productId",
    CREATE_VARIANT:"/variant/create",
    GET_VARIANT: "/variant/",

    CREATE_TAG:"/tag/create",
    GET_TAG:"/tag/",
    //shopping cart
    GET_SHOPPINGCART:"/shopping/",
    ADD_TO_SHOPPINGCART:"/shopping/add",
    REMOVE_ITEM_CART:"/shopping/:itemId",
    //order
    GET_ORDERS:"/order",
    GET_MY_ORDERS:"/order/me",
    CREATE_ORDER:"/order/create",
    UPDATE_STATUS_ORDER:"/order/update/:orderId",
    CANCEL_ORDER:"/order/:orderId",
    GET_ORDER_BY_ID:"/order/order-detail/:orderId",
    //uplaod
    UPLOAD_IMAGE:"/upload/images",

    //brand
    GET_BRAND:"/brand/",
    CREATE_BRAND:"/brand/create",
    //user
    ADD_ADDRESS: "/customer/address/add",
    GET_ADDRESS: "/address/",
    GET_CUSTOMERS:"/customer/",
    GET_PROFILE_USER:"/customer/profile",
    UPDATE_ADDRESS_DEFAULT:"/customer/update-adress/:addressId",
    //discount
    ADD_VOUCHER: "/voucher/add",
    GET_VOUCHER: "/voucher/",
    //send email 
    SEND_INFO_ORDER:"/send/info-order",
    RESET_PASS:"/send/reset-pass",
    RETURN_NEWPASS:"/send/return-newpass",

    //message 
    GET_MESSAGE:`/message`
};

const STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
};

const DB_SCHEMA = {
    OTP: 'Otp',
    ACCOUNT: 'Account',
    USER: 'User',
    BRAND:'Brand',
    CATEGORY:'Category',
    PRODUCT:'Product',
    SHOPINGCART:'ShoppingCart',
    ORDER: 'Order',
    VARIANT:'Variant',
    TAG: 'Tag',
    ADDRESS: 'Address',
    VOUCHER: 'Voucher',
    MESSAGE:'Message'
};

function generateID(length) {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}

const createRandomID = ()=>{
    return uuidv4();
}

export  { API_PATH, STATUS, DB_SCHEMA , createRandomID, generateID};
