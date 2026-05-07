import "./index.css";
import logo from "../../assets/img/logo.png";
interface LoadProps {
    status: Boolean
}

const Loading = ({status}: LoadProps) => {
  return (
    // <div
    //   style={{ zIndex: 9999 }}
    //   className="fixed top-0 left-0 bg-cover bg-center backdrop-blur-3xl backdrop backdrop-saturate-150 backdrop-opacity-75 w-full min-h-screen h-full flex items-center justify-center"
    // >
    //   <div className="px-10 py-10 bg-white rounded-lg">
    //     <div className="flex flex-col items-center space-y-3">
    //       <div className="loader"></div>
    //       {/* <div className="loader2"></div> */}
    //     </div>
    //   </div>
    // </div>
    // <div
    //   style={{ zIndex: 9999 }}
    //   className="fixed top-0 left-0 bg-cover bg-center backdrop-blur-3xl backdrop backdrop-saturate-150 backdrop-opacity-75 w-full min-h-screen h-full flex items-center justify-center"
    // >
    <>
    <div
      style={{ zIndex: status ? 9999 : -9999 }}
      className={`fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50 backdrop-blur-3xl  backdrop-saturate-150 backdrop-opacity-80 transition-opacity duration-500 ${
        status ? "opacity-100" : "opacity-0"
        }`}
    >
      <div className="bg-white px-16 py-10 rounded-xl flex flex-col items-center space-y-3 ">
        <img
          src={logo}
          alt="Loading"
          className="animate-custom-spin mix-blend-multiply"
          style={{ width: 150, height: 150 }}
        />
        <div className="loader3"></div>
      </div>
    </div>
    </>
  );
};

export default Loading;
