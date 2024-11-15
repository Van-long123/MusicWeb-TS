import { convertToSlug } from "./convertToSlug";
const search=(query:Record<string,any>)=>{
    let objectSearch={
        keyword:""
    }
    if(query.keyword){
        objectSearch.keyword = query.keyword,
        objectSearch['keywordRegex']=new RegExp(query.keyword,'i')
        objectSearch['slugRegex']=new RegExp(convertToSlug(query.keyword),'i')
    }
    return objectSearch
}
export default search;