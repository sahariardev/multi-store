import {getUrl} from "./Url";
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

//post request will return empty object if validation found otherwise return the expected result
const postRequest = async (url, data, errorSetters, preProcessor, postProcessor) => {
    if (preProcessor) {
        preProcessor();
    }

    //cleaning all errors
    Object.keys(errorSetters).forEach(errorSetterKey => {
        errorSetters[errorSetterKey]('');
    });

    await fetch(getUrl(url), {
        method: 'POST',
        headers: new Headers({'content-type': 'application/json'}),
        mode: "cors",
        body: JSON.stringify(data)
    }).then((response) => {
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Oops, we haven't got JSON!");
        }

        return {data: response.json(), status: response.status};
    }).then(({data, status}) => {
        data.then(res => {
            postProcessor(res);
            if (status === 412) {
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
        })
    }).catch((errors) => {
        postProcessor();
    });
}