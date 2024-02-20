import appConfigs from '@/stores/configs';

const gTitle = useTitle();

export default function setTitle(title = undefined) {
	if (!title) {
		gTitle.value = `${appConfigs.value.school.shortName} | Plan Lekcji`;
		return;
	}
	gTitle.value = title + ' | Plan Lekcji';
}
