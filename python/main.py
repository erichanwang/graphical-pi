import pygame
import math

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
speed = 0.01
zoom = 1

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEWHEEL:
            zoom += event.y * 0.1
            zoom = min(max(0.1, zoom), 10)

    screen.fill((0, 0, 0))

    zoomed_width = int(width * zoom)
    zoomed_height = int(height * zoom)
    zoomed_surface = pygame.Surface((zoomed_width, zoomed_height))
    zoomed_surface.blit(trail_surface, (0, 0))


    x1 = centerX + radius * math.cos(angle1)
    y1 = centerY + radius * math.sin(angle1)

    x2 = x1 + radius * math.cos(angle2)
    y2 = y1 + radius * math.sin(angle2)

    pygame.draw.circle(trail_surface, (255, 255, 255), (int(x2), int(y2)), 2)

    screen.blit(pygame.transform.scale(trail_surface, (zoomed_width, zoomed_height)), (-(zoomed_width - width) // 2, -(zoomed_height - height) // 2))

    pygame.draw.line(screen, (255, 255, 255), (centerX, centerY), (x1, y1), 2)
    pygame.draw.line(screen, (255, 255, 255), (x1, y1), (x2, y2), 2)

    angle1 += speed
    angle2 += speed * math.pi

    pygame.display.flip()

pygame.quit()
