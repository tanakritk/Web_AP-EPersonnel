import ContentLayout from "../../layout/content-layout"

// import img from '../../assets/img/404.jpg'
const PageNotFound = () => {
    return (
        // <div className='flex h-screen items-center justify-center '>
        //     <img src={img} className='w-[80%] lg:w-[60%]'/>
        // </div>
        <ContentLayout breadcrumbList={[]}>
            <div className="h-[calc(100vh-40px)] bg-white flex flex-col items-center justify-center">
                <p className="text-gray-500 text-9xl font-bold">404</p>
                <p className="text-gray-500 text-2xl font-semibold">Page Not Found</p>
            </div>
        </ContentLayout>
    )
}

export default PageNotFound