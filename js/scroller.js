var Scroller = (function(){
	function Scroller(content, control){
		var self 		= this;
		this.value 		= 0;
		this.content 	= content;
		this.control 	= control;
		this._control 	= new ScrollBar(this.control);

		this.content.css('overflow', 'hidden');

		this.control.on('change', function(e, percent){
			self.goto(percent);
		});

		this.content.on('mousewheel', function(e, d){
			e.preventDefault();
			self.goto(self.value - (d * 5), true);
		});

		this.reset();
	}

	Scroller.prototype.refresh = function(){
		var diff = this.content.innerHeight();
		var percentDiff = (diff * 100) / this.content[0].scrollHeight;

		var height = (this.control.height() * percentDiff) / 100;
		height = height < 20 ? 20 : Math.ceil(height);

		this.control.find('> div').height(height);

		if(this.content[0].scrollHeight > this.content.innerHeight()){
			this.control.show();
		}else{
			this.control.hide();
		}

	}

	Scroller.prototype.reset = function(){
		this.refresh();
		this.goto(0);
	}

	//API simples em porcentagem
	Scroller.prototype.goto = function(p, moveControl){
		p = p < 0 ? 0 : (p > 100 ? 100 : p);
		this.value = p;

		//Position of content
		var yMax = this.content[0].scrollHeight - this.content.innerHeight();
		var y = (yMax * p) / 100;
		this.content.scrollTop(y);

		//Position of control
		if(moveControl){
			yMax = this.control.height() - this.control.find('> div').height();
			y = (yMax * p) / 100;
			this._control.pos.y = y;
			this.control.find('> div').css('top', y);
		}
	}

	//Drag scrollBar
	function ScrollBar(control){
		var self 		= this;

		this.control	= control;

		this.pos		= {x : 0, y: 0};
		this.drag 		= {
			start: 		{x : 0, y: 0},
			current: 	{x : 0, y: 0},
			offset: 	{x : 0, y: 0}, // Diference of start point and current point
			move: 		false
		}

		var mouseDown = function(e){
			e.preventDefault();

			self.drag.offset 	 = {x : 0, y: 0};
			self.drag.start.y 	 = e.pageY;
			self.drag.move		 = true;

			$(document).on('mousemove', mouseMove);
			$(document).on('mouseup', mouseUp);
		}

		var mouseMove = function(e){
			if(!self.drag.move) return false;

			self.drag.current.y = e.pageY;
			self.drag.offset.y 	= self.drag.current.y - self.drag.start.y;

			var yMax = self.control.height() - self.control.find('> div').height();
			var y = self.pos.y + self.drag.offset.y;
			y = y < 0
				? 0
				: (y > yMax ? yMax : y);

			self.control.find('> div').css('top', y);

			self.control.trigger('change', [(y * 100) / yMax]);
		}

		var mouseUp = function(e){
			if(self.drag.move){
				self.pos.y	+= self.drag.offset.y;
			}

			self.drag.move = false;

			$(document).off('mousemove', mouseMove);
			$(document).off('mouseup', mouseUp);
		}

		this.control.find('> div').bind('mousedown', mouseDown);
	}

	return Scroller;
})();