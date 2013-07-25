Scroller
===========

A Custom ScrollBar, simple and clean.

Initialize
-------------

	var autoRefresh = 250; // Time for auto refresh, default is 0 (disabled)
	var s = new Scroller($('#content'), $('#scroll'), autoRefresh);

API
-------------

	s.reset(); // To reset positions
	s.refresh(); // To recalc positions and sizes
	s.goto(percent); // Set position of content by percent
	s.gotoPos(y); // Set position of content by pixel
