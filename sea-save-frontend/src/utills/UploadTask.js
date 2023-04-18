import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "../firebase";
import {v4} from "uuid";

const CusUploadTask = async (file, setLoading) => {

    const storageRef = ref(storage, file.name + v4());
    const uploadTask = uploadBytesResumable(storageRef, file);
    const wq = await uploadTask.on(
        "state_changed",
        (snapshot) => {
            const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            setLoading(true);
            switch (snapshot.state) {
                case "paused":
                    console.log("Upload is paused");
                    break;
                case "running":
                    console.log("Upload is running");
                    break;
                default:
                    break;
            }
        },
        (error) => {
            console.log(error);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {

                return downloadURL;
            });
        }
    );
    return wq;
};

export default CusUploadTask;
