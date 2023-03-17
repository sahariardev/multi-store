const Url = {
    storeCreate: 'store/create',
    storeList:'store/list',
    login:'login',
    userList:'user/listAllUser'
};

export default Url;

const rootUrl = 'http://localhost:8080/'

export const getUrl = (url) => {
    return `${rootUrl}${url}`;
}