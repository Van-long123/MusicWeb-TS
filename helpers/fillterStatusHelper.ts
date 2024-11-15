const fillterStatusHelper=(query: Record<string, any>)=>{
    let fillterStatus=[
        {
            name:"Tất cả",
            status:"",
            class:""
        },
        {
            name:"Hoạt động",
            status:"active",
            class:""
        },
        {
            name:"Dừng hoạt động",
            status:"inactive",
            class:""
        }
    ]
    if(query.status){
        const element=fillterStatus.find(item=>{
            return item.status==query.status
        })
        element.class='active'
    }
    else{
        const element=fillterStatus.find(item=>{
            return item.status==""
        })
        element.class='active'
    }
    return fillterStatus
}

export default fillterStatusHelper

