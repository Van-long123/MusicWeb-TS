const fs=require('fs-extra')
const listFolderCopy=[
    {
        sourceDirectory:"views",
        targetDirectory:"dist/views"//nếu trong dist chưa có thư mục views thì nó sẽ tạo và add các file vào còn nếu có rồi thì nó add file vào
    },
    {   
        sourceDirectory:"public",
        targetDirectory:"dist/public"
    }
]
listFolderCopy.forEach(item=>{
    fs.copy(item.sourceDirectory, item.targetDirectory, err => {
            if (err){
                console.log(`lỗi sao chép thư mục ${item.sourceDirectory}`,err)
          }
            else{
                console.log('success!')
            }
    })
})



// nó sẽ copy folder /tmp/myfile này sang /tmp/mynewfile này 
// fs.copy('/tmp/myfile', '/tmp/mynewfile', err => {
//     if (err) return console.error(err)
//     console.log('success!')
//   })


// bình thường chạy 1 file js  thì node index.js
// ta sẽ tích hợp vào trong bulid luôn 
// "build": "tsc && node copy-dir.js", && là sau khi chạy lệnh tsc xong sẽ chạy lênhj tiếp
// npm run build