const Url = {
    storeCreate: 'store/create'
};

export default Url;

const rootUrl = 'http://localhost:8080/'

export const getUrl = (url) => {
    return `${rootUrl}${url}`;
}