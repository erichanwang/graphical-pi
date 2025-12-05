import pygame
import math
import pygame_widgets
from pygame_widgets.slider import Slider
from pygame_widgets.button import Button

pygame.init()

width, height = 800, 600
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("Graphical Pi")

trail_surface = pygame.Surface((width, height))
trail_surface.fill((0, 0, 0))

centerX, centerY = width // 2, height // 2
radius = min(width, height) // 4

angle1 = 0
angle2 = 0
lastX2, lastY2 = 0, 0
speed = 0.01
zoom = 1
zoomX, zoomY = centerX, centerY
follow = False

def toggle_follow():
    global follow, zoom
    follow = not follow
    if follow:
        zoom = 10
    else:
        zoom = 1

slider = Slider(screen, 10, 10, 200, 10, min=0, max=0.1, step=0.001, initial=0.01)
zoom_in_button = Button(screen, 10, 30, 30, 30, text="+", onClick=lambda: globals().update(zoom=min(globals()['zoom'] * 1.1, 10)))
zoom_out_button = Button(screen, 50, 30, 30, 30, text="-", onClick=lambda: globals().update(zoom=max(globals()['zoom'] * 0.9, 0.1)))
toggle_zoom_button = Button(screen, 90, 30, 100, 30, text="Toggle Follow", onClick=toggle_follow)


running = True
while running:
    events = pygame.event.get()
    for event in events:
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEWHEEL:
            zoom += event.y * 0.1
            zoom = min(max(0.1, zoom), 10)

    screen.fill((0, 0, 0))

    x1 = centerX + radius * math.cos(angle1)
    y1 = centerY + radius * math.sin(angle1)

    x2 = x1 + radius * math.cos(angle2)
    y2 = y1 + radius * math.sin(angle2)
    
    if follow:
        zoomX = x2
        zoomY = y2
    else:
        zoomX = centerX
        zoomY = centerY

    if lastX2 != 0 and lastY2 != 0:
        pygame.draw.line(trail_surface, (255, 255, 255), (lastX2, lastY2), (x2, y2), 1)
    
    lastX2 = x2
    lastY2 = y2
    
    zoomed_width = int(width * zoom)
    zoomed_height = int(height * zoom)
    
    zoomed_trail = pygame.transform.scale(trail_surface, (zoomed_width, zoomed_height))

    if follow:
        screen.blit(zoomed_trail, (width/2 - zoomX*zoom, height/2 - zoomY*zoom))
    else:
        screen.blit(zoomed_trail, (width/2 - centerX*zoom, height/2 - centerY*zoom))


    pygame.draw.line(screen, (255, 255, 255), (width/2 + (centerX-zoomX)*zoom, height/2 + (centerY-zoomY)*zoom), (width/2 + (x1-zoomX)*zoom, height/2 + (y1-zoomY)*zoom), 2)
    pygame.draw.line(screen, (255, 255, 255), (width/2 + (x1-zoomX)*zoom, height/2 + (y1-zoomY)*zoom), (width/2 + (x2-zoomX)*zoom, height/2 + (y2-zoomY)*zoom), 2)


    angle1 += speed
    angle2 += speed * math.pi
    
    speed = slider.getValue()

    pygame_widgets.update(events)
    pygame.display.flip()

pygame.quit()
