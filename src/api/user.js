import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/expert/loginnormal',
    method: 'post',
    data: {
      expertNo: data.username,
      expertPwd: data.password,
      type: '移动端'
    }
    // data: JSON.stringify(data)
  })
}

export function expertpasswordupd (data) {
  return request({
    url: '/expert/expertpasswordupd',
    method: 'post',
    data
  })
}

export function expertcommitment (data) {
  return request({
    url: '/expert/commitment',
    method: 'post',
    data
  })
}

export function expertconfirm (data) {
  return request({
    url: '/expert/expertconfirm',
    method: 'post',
    data
  })
}

export function getmatchinfolist (data) {
  return request({
    url: '/expert/usermatchinfolist',
    method: 'post',
    data
  })
}

export function goEmpower(data) {
  return request({
    url: `/expert/getlogininfomob?code=${data.code}`,
    method: 'get',
  })
}

export function getInfo (token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout () {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
