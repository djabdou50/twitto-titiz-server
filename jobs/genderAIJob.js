import addQueue from '../config/beeQueue'
import GenderML from "../apis/genderML";


let genderML = async (url) => {

    const genderml = new GenderML();
    genderml.initialize({});

    return await genderml.detect(url).then( data => {
        return data;
    })

};

let MLJob = async (test) => {

    console.log(" start listen to jobs " + test)

    addQueue.process(10, async (job) => {
        console.log(`Processing job id ${job.id} data media ${job.data.media}`);

        return await genderML(job.data.media).then( result => {
            console.log('\x1b[36m%s\x1b[0m', "detecting")
            if( result.status !== "ok" ){
                console.log('\x1b[31m%s\x1b[0m: ',"Internal ML server error")
                return "ok";
            }
            if(result.result.length === 1){
                console.log(job.data.media)
                console.log('\x1b[33m%s\x1b[0m: ', result.result[0].gender)
                return result.result[0].gender;
            }else {
                console.log('\x1b[31m%s\x1b[0m: ', "please choose an image with single humain")
                return "ok";
            }
        });
        // return new Tweet(job.data).save();
    });

};

export default MLJob();