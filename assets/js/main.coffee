w = window
d = document

schoolNames =
  alabama: "Alabama",
  arkansas: "Arkansas",
  auburn: "Auburn",
  florida: "Florida",
  georgia: "Georgia",
  kentucky: "Kentucky",
  olemiss: "Ole Miss",
  missstate: "Mississippi State",
  missouri: "Missouri",
  southcarolina: "South Carolina",
  tennessee: "Tennessee",
  vanderbilt: "Vanderbilt"

activeSchool = ""
mqBreakpoints = [0, 400, 600, 800, 1050, 1800]
currentBp = 0

$.domReady ->

  titleBar = $('.title-bar')
  tabBar = $('.tab-bar')
  titleBarHeight = titleBar.height() + tabBar.height()

  currentBp = checkActiveBp()

  $('.nav-drawer').height ($.viewportH() - $('.title-bar').height())
  
  $(w).resize (e) ->
    $('.nav-drawer').height ($.viewportH() - $('.title-bar').height())
    console.log w.innerHeight, $.viewportH()
    currentBp = checkActiveBp()

    
  $('.school-card-container').css('display', 'none')

  navDrawerBtns = $('.nav-drawer ul li')

  navDrawerBtns.on 'click', (e) ->
    $('body').removeClass('tab-bar-collapsed')
    $.timeout(500, -> $('.tab-bar-container').removeClass('hidden'))
    el = $(@).children('.nav-item-container').children('.nav-drawer-btn')[0]
    activeSchool = el.id.split('nav-')[1]
    $('.school-name').html(schoolNames[activeSchool])
    $('#tab-btn-football').addClass('active')
    $('.school-card-container').css('display', 'none')
    $('#school-card-container-' + activeSchool).css('display', 'block')
    $('.nav-drawer').removeClass('show-drawer')
    
  $('.nav-drawer ul li').on 'mouseenter', (e) ->
    $(@).addClass('hover')
  $('.nav-drawer ul li').on 'mouseleave', (e) ->
    $(@).removeClass('hover')

  $('.nav-drawer').on 'mouseenter', (e) ->
    $('.nav-drawer').addClass('show-drawer')
    $('body').removeClass('nav-collapsed')

  $('.nav-drawer').on 'mouseleave', (e) ->
    $('.nav-drawer').removeClass('show-drawer')
    $('body').addClass('nav-collapsed')


  $('#navDrawerBtn').on 'click', (e) ->
    $('.nav-drawer').toggleClass('show-drawer')

  $('.tab-btn').on 'click', (e) ->
    _sport = @.id.split('tab-btn-')[1]
    href = '#' + activeSchool + '-' + _sport + '-section'
    endEl = $(href)[0]
    start = if isNaN(window.pageYOffset) then document.documentElement.scrollTop else window.pageYOffset
    end = getPos(endEl)
    length = getPos(endEl).y - start - 108
    $('.tab-btn').removeClass('active')
    $(@).addClass('active')

    $.tween(500,
      (pos) ->
        #console.log start+length*pos
        w.scrollTo(0, start+length*pos)
      () ->
        console && console.log('done')
      ,null, start, end
    )

  w.scrollTo(0,0)

getPos = (elm) ->
  x = 0
  y = 0
  while elm != null
    x += elm.offsetLeft
    y += elm.offsetTop
    elm = elm.offsetParent
  return {x:x, y:y}


$(w).scroll(->
  navPanCleanup('close')
)

## hammer.js swipe logic
hm = Hammer($('body')[0])
drawer = $('.nav-drawer')
hm.on 'panleft panright', (e) ->
  drawerMinWidth = if currentBp < 801 then 0 else 98
  drawerMaxWidth = 240
  if Math.abs(e.deltaX) > Math.abs(e.deltaY)
    if e.deltaX > 0
      if e.isFinal
        if e.deltaX > (drawerMaxWidth - drawerMinWidth) / 2
          navPanCleanup('open')
        else
          navPanCleanup('close')

      else
        drawer.addClass('swiping')
        $.timeout('hmTimeout', null)
        $.timeout('hmTimeout', 500, navPanCleanup, 'open')

        if e.deltaX < drawerMaxWidth - drawerMinWidth
          drawer.css('width',  drawerMinWidth + e.deltaX)
        else
          drawer.css('width',  drawerMaxWidth)

    else
      if e.isFinal
        if e.deltaX > (drawerMaxWidth - drawerMinWidth) / 2
          navPanCleanup('open')
        else
          navPanCleanup('close')

      else
        drawer.addClass('swiping')
        $.timeout('hmTimeout', null)
        $.timeout('hmTimeout', 500, navPanCleanup, 'close')

        if Math.abs(e.deltaX) < drawerMaxWidth - drawerMinWidth
          drawer.css('width',  drawerMaxWidth + e.deltaX)
        else
          drawer.css('width',  drawerMinWidth)

navPanCleanup = (state) ->
  console.log('inside navPanCleanup')
  if state is 'open'
    drawer.removeClass('swiping')
    drawer.addClass('show-drawer')
    $('body').removeClass('nav-collapsed')
  else
    drawer.removeClass('swiping')
    drawer.removeClass('show-drawer')
    $('body').addClass('nav-collapsed')
  drawer.css('width', '')
  $.timeout('hmTimeout', null)
  return false

checkActiveBp = () ->
  for bp in mqBreakpoints
    if $.viewportW() < bp
      return bp
  return 1800
