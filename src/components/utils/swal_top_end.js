import Swal from "sweetalert2";

export default function SwalTopEnd({icon,title}){

    console.log(icon,title);
    const swal = Swal.fire({
        position: 'top-end',
        icon: icon,
        title:  title,
        showConfirmButton: false,
        timer: 3000,
        toast:true,
        position:'top-right',
        timerProgressBar:true
      })
    return swal;
}

