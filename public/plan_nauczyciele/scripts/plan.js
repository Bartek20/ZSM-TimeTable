var imgPlus,imgMinus
var imgLoaded=false

function loadImg(){
	if(document.images){
		imgPlus=new Image()
		imgPlus.src='images/plus.gif'
		imgMinus=new Image()
		imgMinus.src='images/minus.gif'
		imgLoaded=true
	}
}

loadImg()

function spis(n){
	var e=(document.getElementById)?document.getElementById(n):(document.all)?document.all[n]:null
	if(e!=null){
		if(e.className=='nblk'){
			e.className='blk'
			document.images['i'+n.charAt(0)].src=imgMinus.src
		}
		else{
			e.className='nblk'
			document.images['i'+n.charAt(0)].src=imgPlus.src
		}
	}
}

function drukuj(){
	if(self.parent.frames.length<2)
		alert('Polecenie niedostêpne')
	else{
		self.parent.plan.focus()
		window.print()
	}
}