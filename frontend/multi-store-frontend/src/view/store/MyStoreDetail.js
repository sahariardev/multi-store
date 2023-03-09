import { useParams } from "react-router-dom";

const MyStoreDetail = () => {
    const {id} = useParams();
    
    return (
        <div>
            My Store Detail {id}
        </div>
    );
}

export default MyStoreDetail;