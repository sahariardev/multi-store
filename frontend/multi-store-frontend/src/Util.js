import {getUrl} from "./Url";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

export const getLoggedInUserInfo = () => {
    return jwt_decode(Cookies.get('token'));
}

export const hasRole = (role) => {
    const user = getLoggedInUserInfo();

    if (!user || !user.roles) {
        return false;
    }

    user.roles.forEach(role => {
        if (role.name === role) {
            return true;
        }
    });

    return false;
}

export const dataTableStyles = {
    headRow: {
        style: {
            border: 'none',
        },
    },
    headCells: {
        style: {
            color: '#202124',
            fontSize: '14px',
        },
    },
    rows: {
        highlightOnHoverStyle: {
            backgroundColor: 'rgb(230, 244, 244)',
            borderBottomColor: '#FFFFFF',
            borderRadius: '25px',
            outline: '1px solid #FFFFFF',
        },
    },
    pagination: {
        style: {
            border: 'none',
        },
    },
};

export const getRequest = async (url) => {
    return await fetch(getUrl(url), {
        headers: new Headers({'content-type': 'application/json', 'Authorization': 'Bearer ' + Cookies.get('token')})
    })
        .then((response) => response.json())
        .then(data => {
                return data;
            }
        );
}

//post request will return empty object if validation found otherwise return the expected result
export const postRequest = async (url, data, errorSetters, preProcessor, postProcessor) => {
    preProcessor && preProcessor();

    if (!errorSetters) {
        errorSetters = {};
    }
    //cleaning all errors
    Object.keys(errorSetters).forEach(errorSetterKey => {
        errorSetters[errorSetterKey]('');
    });

    return await fetch(getUrl(url), {
        method: 'POST',
        headers: new Headers({'content-type': 'application/json', 'Authorization': 'Bearer ' + Cookies.get('token')}),
        mode: "cors",
        body: JSON.stringify(data)
    }).then((response) => {
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Oops, we haven't got JSON!");
        }

        return {data: response.json(), status: response.status};
    }).then(async ({data, status}) => {
        return await data.then(res => {
            postProcessor && postProcessor(res);
            console.log(res);
            if (status === 412 || status === 401) {
                res.forEach(error => {
                    let errorSetter = errorSetters[error.fieldName];
                    if (errorSetter) {
                        errorSetter(error.message);
                    }
                });
                return {};
            } else if (status === 200) {
                return res;
            }
        });
    }).catch((errors) => {
        console.log(errors);
        postProcessor();
    });
}
