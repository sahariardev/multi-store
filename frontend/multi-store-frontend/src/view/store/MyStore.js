import { Link } from "react-router-dom";

const MyStore = () => {
    return (
        <div>
            My Store <Link to={`/mystoreDetail/1`}>Go To Detail</Link>
        </div>
    );
}

export default MyStore;