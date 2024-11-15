const pagination=(query:Record<string,any>,countSongs:number,objectPagination:Record<string,number>)=>{
    const totalPage:number=Math.ceil(countSongs / objectPagination.limitItems)
    objectPagination.totalPage=totalPage
    if(query.page){
        objectPagination.currentPage=parseInt(query.page)
    }
    objectPagination.skip=( objectPagination.currentPage-1)*objectPagination.limitItems
    return objectPagination
}
export default pagination