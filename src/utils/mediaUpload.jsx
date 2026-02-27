import {createClient} from "@supabase/supabase-js"

const url = "https://uwquseefhjiofrsihdmk.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3cXVzZWVmaGppb2Zyc2loZG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwODQ0MTMsImV4cCI6MjA4NzY2MDQxM30.lJLtf_An1md0BwE1ncxX6C1bKJ5PaWokQYgv81xpM_8"

const supabase = createClient(url,key)

export default function mediaUpload(file){
    const mediaUploadPromise = new Promise(
        (resolve, reject)=>{
            if(file == null){
                reject("No file provided")
                return
            }

            const timestamp = new Date().getTime()
            const newName = timestamp+file.name

            supabase.storage.from("skyrex-pr1-images").upload(newName, file,{
                upsert:false,
                cacheControl:"3600"
            }).then(()=>{
                const publicUrl = supabase.storage.from("skyrex-pr1-images").getPublicUrl(newName).data.publicUrl
                resolve(publicUrl)
            }).catch(
                (e)=>{
                    reject("Error Occurred during upload")
                }
            )
        }
    )

    return mediaUploadPromise
}

