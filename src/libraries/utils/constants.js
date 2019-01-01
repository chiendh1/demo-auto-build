const constants = {
    BASE_URL_API: 'http://app-noithat.yez.vn/api',
    BASE_URL: 'http://app-noithat.yez.vn',
    SERVER_TIMEOUT: 10000,
    
    socialLoginType: {
        FACEBOOK: 1,
        GOOGLE: 2,
    },

    validatePhoneType: {
        FORGOT_PASSWORD: 1,
        UPDATE_PHONE_NUMBER: 2,
        CREATE_NEW_ACCOUNT: 3,
        CREATE_NEW_SIGN_UP: 4,
    },

    upgradeAcc: {
        GUEST: 1,
        KTS: 2,
        THO: 3,
        NX: 4,
        NBS: 5,
        SV: 6,
        DONE: 7
    },
    notification: {
        //Naang cap tai khoan
        UPGRADE_USER: 1,
        //Khi nhap ma gioi thieu
        INVITATION_CODE: 2,
        //Thong bao khi co ho so moi quanh ban
        NOTIFY_FOR_NEW_PROFILE: 3,
        //Thong bao sau 1 ngay tu khi click call now
        CALL_NOW: 4,
        //Sau 7 ngay tu khi dang tin tuyen dung
        SEVEN_DAY_WORK: 5,
        //Sau 7 ngay tu khi dang ho so
        SEVEN_DAY_PROFILE: 6,
        //Thong bao khi co tin tuyen dung moi,
        NOTIFY_NEW_RECRUITMENT: 7,
        //Rêcive Notification when someone comments
        NOTIFY_FOR_NEW_COMMENT: 8, 
    },
    QRcode: {
        SiUp: 1,
        Intro: 2
    },

    CANDIDATE: {
        STUDENT_CANDIDATE: 'STUDENT_CANDIDATE',
        WORKER_CANDIDATE: 'WORKER_CANDIDATE',
        MAP_CANDIDATE: 'MAP_CANDIDATE',
        
    },

    RECRUITER: {
        STUDENT_RECRUITER: 'STUDENT_RECRUITER',
        WORKER_RECRUITER: 'WORKER_RECRUITER',
        MAP_RECRUITER: 'MAP_RECRUITER',
        ALL: 'ALL',
        EDIT_JOB: 'EDIT_JOB'
    },

    SERVICES: {
        SelectService1: 'SelectService1',
        SelectService2: 'SelectService2',
        WorkerAdvanced: 'WorkerAdvanced',
        WorkerStudent: 'WorkerStudent',
        PostJobRecruitment: 'PostJobRecruitment',
        SearchFilter: 'SearchFilter',
        UpgradeAcc: 'UpgradeAcc',
        EditProfile: 'EditProfile'
    },
    
    ProfileType: {
        Student: 0,
        Worker_Basic: 1,
        Worker_Advanced: 2,
        ALL: 3,
    },

    PROFILE: {
        SAVE_PROFILE: 'SAVE_PROFILE',
        REMOVE_PROFILE: 'REMOVE_PROFILE',
        EDIT_PROFILE: 'EDIT_PROFILE',
    },

    saveProfile: {
        save: 1,
        remove: 0
    },

    reloadList: {
        DEFAULT: 0,
        SAVE_JOB: 1,
        SAVE_PROFILE: 2,
        UPGRADE_USER: 3
    },

    config: {
        POINT_NULL: 0,
    }
}

export default constants;