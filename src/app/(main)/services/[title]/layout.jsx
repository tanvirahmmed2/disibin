


export async function generateMetadata({params}) {
   const { title } = await params
      return {
        title:`${title.toUpperCase().replace('-', " ")} | Disibin`,
        description:`${title} page`
      }
  
}

const ServiceLayout = ({children}) => {
  return (
    <div className="w-full">
      {children}
    </div>
  )
}

export default ServiceLayout
