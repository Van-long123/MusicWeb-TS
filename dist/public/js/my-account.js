// upload Image 
const uploadImage=document.querySelector('[upload-image]');
if(uploadImage){
    const uploadImageInput=document.querySelector('[upload-image-input]')
    const uploadImagePreview=document.querySelector('[upload-image-preview]')
    uploadImageInput.addEventListener('change',e=>{
        const file=e.target.files[0]
        if(file){
            uploadImagePreview.src = URL.createObjectURL(file)
        }
    })

}


const selectElement=document.querySelector('#selCity')
if(selectElement){
    const selectedCityId = selectElement.getAttribute('city-id');
    const optionToSelect  = selectElement.querySelector(`option[value="${selectedCityId}"]`);
    if(optionToSelect){
        optionToSelect.selected=true
    }
}
// show alert
const showAlert=document.querySelector('[show-alert]')
if(showAlert){
    const time=parseInt(showAlert.getAttribute('data-time'))
    setTimeout(() => {
        showAlert.classList.add('d-none')
    }, time);
}
// show alert
// close show alert 
const closeAlert=document.querySelector('[close-alert]')
if(closeAlert){
    closeAlert.addEventListener('click',e=>{
        showAlert.classList.add('d-none')
    })
}
// close show alert 

const userProvince=document.querySelector('#userProvince')
if(userProvince){
    const provinceMap = {
        '1': 'An Giang',
        '2': 'Bà Rịa-Vũng Tàu',
        '3': 'Bắc Giang',
        '4': 'Bắc Kạn',
        '5': 'Bạc Liêu',
        '6': 'Bắc Ninh',
        '7': 'Bến Tre',
        '8': 'Bình Định',
        '9': 'Bình Dương',
        '10': 'Bình Phước',
        '11': 'Bình Thuận',
        '12': 'Cà Mau',
        '13': 'Cần Thơ',
        '14': 'Cao Bằng',
        '15': 'Đà Nẵng',
        '16': 'Đăk Lăk',
        '17': 'Đăk Nông',
        '18': 'Điện Biên',
        '19': 'Đồng Nai',
        '20': 'Đồng Tháp',
        '21': 'Gia Lai',
        '22': 'Hà Giang',
        '23': 'Hà Nam',
        '24': 'Hà Nội',
        '25': 'Hà Tĩnh',
        '26': 'Hải Dương',
        '27': 'Hải Phòng',
        '28': 'Hậu Giang',
        '29': 'Hoà Bình',
        '30': 'Hưng Yên',
        '31': 'Khánh Hòa',
        '32': 'Kiên Giang',
        '33': 'Kon Tum',
        '34': 'Lai Châu',
        '35': 'Lâm Đồng',
        '36': 'Lạng Sơn',
        '37': 'Lào Cai',
        '38': 'Long An',
        '39': 'Nam Định',
        '40': 'Nghệ An',
        '41': 'Ninh Bình',
        '42': 'Ninh Thuận',
        '43': 'Phú Thọ',
        '44': 'Phú Yên',
        '45': 'Quảng Bình',
        '46': 'Quảng Nam',
        '47': 'Quảng Ngãi',
        '48': 'Quảng Ninh',
        '49': 'Quảng Trị',
        '50': 'Sóc Trăng',
        '51': 'Sơn La',
        '52': 'Tây Ninh',
        '53': 'Thái Bình',
        '54': 'Thái Nguyên',
        '55': 'Thanh Hóa',
        '56': 'Thừa Thiên-Huế',
        '57': 'Tiền Giang',
        '58': 'Hồ Chí Minh',
        '59': 'Trà Vinh',
        '60': 'Tuyên Quang',
        '61': 'Vĩnh Long',
        '62': 'Vĩnh Phúc',
        '63': 'Yên Bái'
      };
    const provinceId =userProvince.getAttribute('data-province')
    userProvince.innerHTML=`Tỉnh thành: ` + provinceMap[provinceId] || '';
}