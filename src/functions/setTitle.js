const gTitle = useTitle();

export default function setTitle(title = undefined) {
	if (!title) {
		gTitle.value = 'Plan Lekcji';
		return;
	}
	gTitle.value = title + ' | Plan Lekcji';
}
