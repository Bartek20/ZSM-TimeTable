import { defineStore } from 'pinia'
import axios from 'axios'

const API = 'https://worldtimeapi.org/api/timezone/Europe/Warsaw'

export const useTimeStore = defineStore('time', {
	state: () => {
		return {
			API_TZ: undefined,
			API_DAY: undefined,
			API_TIME: undefined,
			OS_TZ: undefined,
			OS_DAY: undefined,
			OS_TIME: undefined,
			os_OK: false
		}
	},
	actions: {
		setTwo(el) {
			if (el < 10) return '0' + el
			return el
		},
		checkTime(API, OS) {
			return (API == OS)
		},
		async getTime() {
			if (!this.os_OK) {
				const res = await axios.get(API)
				
				this.API_TZ = parseInt(res.data.raw_offset) / -60
				this.API_DAY = res.data.day_of_week
				this.API_TIME = res.data.datetime.replace(/\d\d\d\d-\d\d-\d\dT/, '').replace(/.\d+\+\d\d:\d\d/, '')
			}
			const time = new Date()
			this.OS_TZ = time.getTimezoneOffset()
			this.OS_DAY = time.getDay()
			const H = time.getHours()
			const M = time.getMinutes()
			const S = time.getSeconds()
			this.OS_TIME = this.setTwo(H) + ':' + this.setTwo(M) + ':' + this.setTwo(S)
			if (!this.os_OK && this.checkTime(this.API_DAY, this.OS_DAY) && this.checkTime(this.API_TZ, this.OS_TZ)) { this.os_OK = true }
		}
	}
})