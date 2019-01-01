import NavigationService from 'routers/NavigationService';
import { Status } from './status';
import axios from 'axios';
import constants from 'libraries/utils/constants';
import database, { KEY_USER_TOKEN, KEY_GET_STARTED_PRESSED, KEY_USER } from 'libraries/utils/database';
import { showMessage } from 'libraries/utils/utils';
import R from 'res/R';



export const APIS = {
    CONCENTRATE_RECRUITMENT: '/concentrate-recruitment',
    CONCENTRATE_PROFILE: '/concentrate-profile',
}

var instance = axios.create({
    baseURL: constants.BASE_URL_API,
    timeout: constants.SERVER_TIMEOUT,
})

function tokenInvalid() {
    showMessage(R.strings.common.token_invalid)
    database.tokenCache = ''
    database.user = {}
    database.save(KEY_USER_TOKEN, database.tokenCache);
    database.save(KEY_GET_STARTED_PRESSED, false.toString());
    database.save(KEY_USER, '');
    NavigationService.reset('LoginScreen')
}

export function loginAPI(telephone, password) {
    return instance.post('/login',
        {
            phone: telephone,
            password
        })
        .then(response => {
            return response.data
        }).catch(error => {
            return error
        })

}

export function signupAPI(name, phone, password, confirm_password, code_intro) {
    return instance.post('/register',
        {
            name,
            password,
            confirm_password,
            phone,
            code_intro
        })
        .then(response => {
            return response.data
        }).catch(error => {
            return error
        })
}

export function checkAPISocial(type, access_token) {
    return instance.post('/check_token',
        {
            type,
            access_token
        }).then(response => {
            return response.data
        }).catch(error => {
            return error
        })
}

export function LoginSocial(name, email, phone, access_token, type) {
    return instance.post('/login_social',
        {
            name,
            email,
            phone,
            access_token,
            type
        })
        .then(response => {
            return response.data
        }).catch(error => {
            return error
        })
}


export function checkPhone(phone) {
    return instance.post('/check_phone', {
        phone
    })
        .then(response => {
            return response.data
        }).catch(error => {
            return error
        })
}
export function forgotPassword(phone, password) {
    return instance.post('/forgot_password', {
        phone,
        password
    })
        .then(response => {
            return response.data
        }).catch(error => {
            return error
        })
}


export function updatePhone(type, access_token, phone) {
    return instance.post('/update_phone', {
        type,
        access_token,
        phone,
    })
        .then(response => {
            return response.data
        }).catch(error => {
            return error
        })
}


export function putExampleAPI(param1, param2) {
    return instance.put('', {
        param1,
        param2
    })
}
export function getProvince() {
    return instance.get('/get-province')
        .then(response => {
            return response.data
        }).catch(error => {
            return error
        })
}

export function getDistrict(provice_id) {
    return instance.get(`/get-district/${provice_id}`, {
        headers: {
            Authorization: 'Bearer ' + database.tokenCache
        }
    })
        .then(response => {
            if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
                tokenInvalid();
                return;
            }
            return response.data
        }).catch(error => {
            return error
        })
}
export function getWard(district_id) {
    return instance.get(`/get-ward/${district_id}`, {
        headers: {
            Authorization: 'Bearer ' + database.tokenCache
        }
    })
        .then(response => {
            if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
                tokenInvalid();
                return;
            }
            return response.data
        }).catch(error => {
            return error
        })
}

export function getCondition(token) {
    return instance.get('/get-right-condition', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
                tokenInvalid();
                return;
            }
            return response.data
        }).catch(error => {
            return error
        })
}

export function getVoucher(token) {
    return instance.get('/get-voucher', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            tokenInvalid();
            return;
        }
        return response.data
    }).catch(error => {
        return error
    })
}

export function putIntroduceFriend(id_users, code_intro, token) {
    return instance.put(`/update-code-intro/${id_users}`, {
        code_intro
    }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        }).then(response => {
            if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
                tokenInvalid();
                return;
            }
            return response.data
        }).catch(error => {
            return error
        })
}

export function getHistoryVoucher(user_id, token) {
    return instance.get(`/history-voucher/${user_id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            tokenInvalid();
            return;
        }
        return response.data
    }).catch(error => {
        return error;
    })
}


export function getRoleUser() {
    return instance.get('/get-role-user', {
        headers: {
            Authorization: 'Bearer ' + database.tokenCache
        }
    }).then(response => {
        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            tokenInvalid();
            return;
        }
        return response.data
    }).catch(error => {
        return error;
    })
}


export function getService() {
    return instance.get('/get-service', {
        headers: {
            Authorization: 'Bearer ' + database.tokenCache
        }
    })
        .then(response => {
            return response.data
        }).catch(error => {
            return error
        })
}


export function postUploadImage(token, image, uploadProgress) {
    let imageName = new Date().getTime() + '.png';
    const formData = new FormData();
    formData.append('images[]', {
        uri: image.uri,
        name: imageName,
        type: 'image/jpeg',
    });
    const config = {
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total) / 100;
            uploadProgress(percentCompleted);
        }
    };
    return instance.post(`/upload/image`, formData, {
        ...config,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',

        }
    }).then(response => {
        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            tokenInvalid();
            return;
        }
        return response.data
    }).catch(error => {
        return error;
    })

}

export function postUploadVideo(token, video, uploadProgress) {
    let videoName = new Date().getTime() + '.mp4';
    const formData = new FormData();
    formData.append('videos[]', {
        uri: video.uri,
        name: videoName,
        type: 'video/mp4',
    });
    const config = {
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total) / 100;

            uploadProgress(percentCompleted);
        }
    };
    return instance.post(`/upload/video`, formData, {
        ...config,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',

        }
    }).then(response => {

        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            tokenInvalid();
            return;
        }
        return response.data
    }).catch(error => {
        return error;
    })
}

export function putUpdateInfo(id_users, token, type, name, address, city_name, lat_lng, service, images, identity_card, specialize_id) {
    return instance.put(`/upgrade-account/${id_users}`, {
        type,
        name,
        address,
        city_name,
        lat_lng,
        service,
        images,
        identity_card,
        specialize_id
    }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        }).then(response => {
            if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
                tokenInvalid();
                return;
            }
            return response.data
        }).catch(error => {
            return error
        })
}

export function getConfig(token) {
    return instance.get('/config', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            tokenInvalid();
            return;
        }
        return response.data
    }).catch(error => {
        return error
    })
}

export function putUpgradeUser(id_users, token) {
    return instance.put(`/upgrade-user/${id_users}`, {}, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            tokenInvalid();
            return;
        }
        return response.data
    }).catch(error => {
        return error;
    })
}

export function putVoucher(id_users, token, id) {

    return instance.put(`/change-voucher/${id_users}`, {
        id
    }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        }).then(response => {
            if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
                tokenInvalid();
                return;
            }
            return response.data
        }).catch(error => {
            return error
        })
}

export function getUserInfo(id_users, token) {
    return instance.get(`/info-user/${id_users}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            tokenInvalid();
            return;
        }
        return response.data
    }).catch(error => {
        return error;
    })
}

export function getLevel() {
    return instance.get('/level').then(response => {
        return response.data
    }).catch(error => {
        return error;
    })
}

export function fetchAPI(url, data, isAuth) {
    let headers = null
    if (isAuth) {
        headers = {
            Authorization: `Bearer ${database.tokenCache}`
        }
    }

    return instance.get(url, {
        params: {
            ...data
        },
        headers: headers
    }).then(response => {
        return response.data
    }).catch(error => {
        return error;
    })
}


export function getExperience() {
    return instance.get('/experience').then(response => {
        return response.data
    }).catch(error => {
        return error;
    })
}
export function getOvertime(token) {
    return instance.get('/overtime', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            tokenInvalid();
            return;
        }
        return response.data
    }).catch(error => {
        return error;
    })
}

export function postProfile(token, data) {
    return instance.post('/profile', {
        ...data
    },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
                tokenInvalid();
                return;
            }
            return response.data
        }).catch(error => {
            return error;
        })
}

export function getTypeProfile(token, data) {

    return instance.get(`/profile/${data.type}`, {
        params: {
            ...data
        },

        headers: {
            Authorization: `Bearer ${token}`
        }

    }).then(response => {
        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            tokenInvalid();
            return;
        }
        return response.data
    }).catch(error => {
        return error;
    })
}
export function postRecruitment(token, data) {
    return instance.post('/recruitment', {
        ...data
    },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
                tokenInvalid();
                return;
            }
            return response.data
        }).catch(error => {
            return error;
        })
}


export function putUpdateRecruitment(token, id, data) {
    return instance.put(`/recruitment/${id}`, {
        ...data
    }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        }).then(response => {
            if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
                tokenInvalid();
                return;
            }
            return response.data
        }).catch(error => {
            return error
        })
}


export function getRecruiment(id) {
    return instance.get(`/recruitment/${id}`).then(response => {
        return response.data
    }).catch(error => {
        return error;
    })
}

export function getListRecruiment(type, user_id, page, search, region, service_id, wage_max, wage_min, address_name) {
    let lat_lng = null;
    if (region) {
        lat_lng = `${region.latitude}, ${region.longitude}`
    }

    return instance.get(`/list-recruitment/${type}/${user_id}`, {
        params: {
            page,
            search,
            lat_lng,
            service_id,
            wage_max,
            wage_min,
            address_name
        },
    }
    ).then(response => {
        return response.data
    }).catch(error => {
        return error;
    })
}

export function postProfileSave(user_id, profile_id, is_saved, token) {
    return instance.post('/profile-saved', {
        user_id,
        profile_id,
        is_saved
    }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
                tokenInvalid();
                return;
            }
            return response.data
        }).catch(error => {
            return error;
        })
}

export function getDetailRecruiment(id) {

    return instance.get(`/detail-recruitment/${id}`).then(response => {
        return response.data
    }).catch(error => {
        return error;
    })
}

export function getProfileDetail(id_profile, token) {
    return instance.get(`/profile-detail/${id_profile}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            tokenInvalid();
            return;
        }
        return response.data
    }).catch(error => {
        return error;
    })
}

export function getProfilesForMap(token, lat_lng) {
    return instance.get('/profile-coordinate', {
        params: {
            lat_lng
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            return;
        }
        return response.data
    }).catch(error => {
        return error;
    })
}

export function getRecruiterForMap(user_id, lat_lng) {
    return instance.get(`/recruitment-coordinate/${user_id}`, {
        params: {
            lat_lng
        }
    }).then(response => {
        return response.data
    }).catch(error => {
        return error;
    })
}


export function postJobSave(user_id, saved_job_id, is_saved, token) {
    return instance.post('/save-job', {
        user_id,
        saved_job_id,
        is_saved
    }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
                tokenInvalid();
                return;
            }
            return response.data
        }).catch(error => {
            return error;
        })
}


export function getSavedJob(id, token) {
    return instance.get(`/saved-job/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            tokenInvalid();
            return;
        }
        return response.data
    }).catch(error => {
        return error;
    })
}

export function deleteJob(id, token) {
    return instance.delete(`/saved-job/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            tokenInvalid();
            return;
        }
        return response.data
    }).catch(error => {
        return error;
    })
}


export function getProfileSave(id, token) {
    return instance.get(`/profile-saved/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            tokenInvalid();
            return;
        }
        return response.data
    }).catch(error => {
        return error;
    })
}
export function deleteSaveProfile(id, token) {
    return instance.delete(`/profile-saved/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            tokenInvalid();
            return;
        }
        return response.data
    }).catch(error => {
        return error;
    })
}

export function deleteRecruiment(id, token) {
    return instance.delete(`/recruitment/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            tokenInvalid();
            return;
        }
        return response.data
    }).catch(error => {
        return error;
    })
}

export function getProfileOfMe(id, token) {
    return instance.get(`/profile-of-me/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            tokenInvalid();
            return;
        }
        return response.data
    }).catch(error => {
        return error;
    })
}

export function postCallNowRecruiment(id, recruitment_id, profile_id, token, user_receive) {
    return instance.post(`/call-now/${id}`, {
        recruitment_id,
        profile_id,
        user_receive
    }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
                tokenInvalid();
                return;
            }
            return response.data
        }).catch(error => {
            return error;
        })
}

export function deleteProfileOfMe(id, token) {
    return instance.delete(`/profile/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            tokenInvalid();
            return;
        }
        return response.data
    }).catch(error => {
        return error;
    })
}

export function editProfileOfMe(token, data) {
    return instance.put(`/profile/${data.id}`, {
        ...data
    }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        }).then(response => {
            if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
                tokenInvalid();
                return;
            }
            return response.data
        }).catch(error => {
            return error
        })
}

export function postComment(token, data) {
    return instance.post('/comments', {
        ...data,
    }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        }).then(response => {
            if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
                tokenInvalid();
                return;
            }
            return response.data
        }).catch(error => {
            return error
        })
}

export function getComment(id) {
    return instance.get(`/comments/${id}`)
        .then(response => {
            return response.data
        }).catch(error => {
            return error
        })
}

export function putUpdateUser(token, data) {
    return instance.put(`/update-user/${data.id_users}`, { ...data }, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if (response.data.code === Status.UNAUTHORIZED_TOKEN_INVALID) {
            tokenInvalid();
            return;
        }
        return response.data
    }).catch(error => {
        return error
    })
}


export function getCommentDetail(id, token) {
    return instance.get(`/comment-detail/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }).then(response => {
        return response.data
    }).catch(error => {
        return error
    })
}


export function getSpecialize() {
    return instance.get('/specialize'
    ).then(response => {
        return response.data
    }).catch(error => {
        return error
    })
}