import {ProgressSpinner} from "primereact/progressspinner";
import {useSelector} from "react-redux";

const LoaderComponent = () => {
    const showLoader = useSelector(state => state.common.showLoader);

    if (showLoader) {
        return (<div className="loader-parent">
            <ProgressSpinner className="top-mar-150"/>
        </div>);
    } else {
        return '';
    }
}

export default LoaderComponent;