import {useState, useEffect} from "react";
import Url, {getUrl} from './../../Url';
import DisabledBtn from "../../DisabledBtn";
import { useNavigate } from "react-router-dom";

import {useDispatch} from "react-redux";
import {updatePagerHeader} from './myStoreSlice';
import {updateDonePageContent} from '../done/donePageSlice';

const MyStore = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(updatePagerHeader('Store'));
    });

    const [storeName, setStoreName] = useState();
    const [street1, setStreet1] = useState();
    const [street2, setStreet2] = useState();
    const [city, setCity] = useState();
    const [zip, setZip] = useState();
    const [storeType, setStoreType] = useState('REGULAR');
    const [description, setDescription] = useState();

    //errors
    const [nameError, setNameError] = useState();
    const [loader, setLoader] = useState(false);

    const submitForm = async () => {
        const data = {
            'name': storeName,
            'street1': street1,
            'street2': street2,
            'city': city,
            'zip': zip,
            'type': storeType,
            'description': description,
        }

        const errorSetters = {
            name: setNameError
        };

        Object.keys(errorSetters).forEach(errorSetterKey => {
            errorSetters[errorSetterKey]('');
        });

        setLoader(true);
        await fetch(getUrl(Url.storeCreate), {
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
                setLoader(false);
                if (status === 412) {
                    res.forEach(error => {
                        let errorSetter = errorSetters[error.fieldName];
                        if (errorSetter) {
                            errorSetter(error.message);
                        }
                    });
                } else if (status === 200) {
                    dispatch(updateDonePageContent({message:`Store created with id : ${res.id}`}));
                    navigate('/done');
                }
            })
        }).catch((errors) => {
            setLoader(false);
        });
    }

    return (
        <div className="container">
            <div>
                <form className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="storeName" className="col-sm-3">Store Name</label>
                        <div className="col-sm-5">
                            <input type="text" id="storeName" className="form-control"
                                   onChange={(e) => setStoreName(e.target.value)} value={storeName} />
                        </div>
                        {nameError && (<div className="col-sm-5 form-error-message">{nameError}</div>)}
                    </div>

                    <div className="form-group">
                        <label htmlFor="control-demo-1" className="col-sm-3">Address</label>
                        <div className="row">
                            <div className="col-sm-5">
                                <input type="text" id="control-demo-1" className="form-control" placeholder="street1"
                                       onChange={(e) => setStreet1(e.target.value)} value={street1}/>
                            </div>
                            <div className="col-sm-5">
                                <input type="text" id="control-demo-1" className="form-control" placeholder="street2"
                                       onChange={(e) => setStreet2(e.target.value)} value={street2}/>
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-sm-5">
                                <input type="text" id="control-demo-1" className="form-control" placeholder="city"
                                       onChange={(e) => setCity(e.target.value)} value={city}/>
                            </div>
                            <div className="col-sm-5">
                                <input type="text" id="control-demo-1" className="form-control" placeholder="zip"
                                       onChange={(e) => setZip(e.target.value)} value={zip}/>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="control-demo-1" className="col-sm-3">Store Type</label>
                        <div className="col-sm-5">
                            <select className="form-control" onChange={(e) => setStoreType(e.target.value)}
                                    value={storeType}>
                                <option value="REGULAR">Regular</option>
                                <option value="MULTISTORE">Multi Store</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="control-demo-1" className="col-sm-3">Store Description</label>
                        <div className="col-sm-5">
                            <textarea name="control-demo-5" id="control-demo-5" className="form-control" cols="30"
                                      rows="10" onChange={(e) => setDescription(e.target.value)}
                                      value={description}/>
                        </div>
                    </div>

                    {!loader && (<div className="row footer-btn-container">
                        <div className="col-sm-2">
                            <div className="btn btn-primary btn-block" onClick={() => navigate('/myStoreList')}>
                                Back
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="btn btn-primary btn-block" onClick={() => submitForm()}>
                                  Submit
                            </div>
                        </div>
                    </div>)}

                    {loader && (<div className="row footer-btn-container"><DisabledBtn/></div>)}

                </form>
            </div>
        </div>
    );
}

export default MyStore;