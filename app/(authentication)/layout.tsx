const AuthenticationLayout = ({
    children
}:{
    children: React.ReactNode
}) => {

    return (
        <div className="h-full">
            
            <main className="pt-16 sm:pt-0 pb-20 h-full">
                {children}
            </main>
            
        </div>  
    )

}

export default AuthenticationLayout