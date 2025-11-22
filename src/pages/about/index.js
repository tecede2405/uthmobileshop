import {useEffect} from "react";

function About() {
     // Cuộn lên đầu
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    return(
        <>
            <h1>Trang sẽ cập nhật sau !</h1>
        </>
    )
}
export default About;