#!/usr/bin/env python3
"""AstroPet Desktop Runner — Borderless Always-On-Top Pixel Companion for macOS/Linux/Windows."""
import tkinter as tk
import random
import math
import time

PALETTE = {
    0: None,
    1: "#181825",  # Outline
    2: "#89B4FA",  # Body Blue
    3: "#B4BEFE",  # Highlight Lavender
    4: "#F38BA8",  # Cheek Pink
    5: "#F9E2AF",  # Star Gold
    6: "#A6E3A1",  # Visor Mint
}

SPRITE_IDLE = [
    [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,1,1,5,5,1,1,5,5,1,1,0,0,0],
    [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
    [0,1,2,3,3,2,2,2,2,2,2,3,3,2,1,0],
    [0,1,2,1,1,1,1,1,1,1,1,1,1,2,1,0],
    [1,2,2,1,6,6,1,6,6,6,1,6,6,1,2,1],
    [1,2,2,1,6,6,1,6,6,6,1,6,6,1,2,1],
    [1,2,2,1,1,1,1,1,1,1,1,1,1,2,2,1],
    [1,2,4,4,2,2,2,1,1,2,2,2,4,4,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [0,1,2,2,5,5,5,5,5,5,5,5,2,2,1,0],
    [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
    [0,0,1,2,2,2,1,1,1,1,2,2,2,1,0,0],
    [0,0,1,2,2,1,0,0,0,0,1,2,2,1,0,0],
    [0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]

class AstroPetDesktop:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("AstroPet")
        self.root.overrideredirect(True)
        self.root.attributes("-topmost", True)
        self.scale = 6
        self.size = 16 * self.scale
        self.x = 260
        self.y = 680
        self.vx = 2.0
        self.state = "WANDER"
        self.hunger = 88
        self.energy = 94
        self.canvas = tk.Canvas(self.root, width=self.size, height=self.size, bg="#11111B", highlightthickness=0)
        self.canvas.pack()
        self.canvas.bind("<Button-1>", self.on_click)
        self.canvas.bind("<B1-Motion>", self.on_drag)
        self.tick()

    def on_click(self, event):
        self.hunger = min(100, self.hunger + 10)
        self.state = "HAPPY"

    def on_drag(self, event):
        self.x = event.x_root - self.size // 2
        self.y = event.y_root - self.size // 2
        self.root.geometry(f"{self.size}x{self.size}+{int(self.x)}+{int(self.y)}")

    def draw_sprite(self, bob=0):
        self.canvas.delete("all")
        for r, row in enumerate(SPRITE_IDLE):
            for c, val in enumerate(row):
                color = PALETTE.get(val)
                if color:
                    x0 = c * self.scale
                    y0 = (r * self.scale) + bob
                    self.canvas.create_rectangle(x0, y0, x0 + self.scale, y0 + self.scale, fill=color, outline="")

    def tick(self):
        if self.state == "WANDER":
            self.x += self.vx
            if self.x < 80 or self.x > 960:
                self.vx = -self.vx
        bob = int(math.sin(time.time() * 6.0) * 3)
        self.draw_sprite(bob=bob)
        self.root.geometry(f"{self.size}x{self.size}+{int(self.x)}+{int(self.y)}")
        self.root.after(33, self.tick)

    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    AstroPetDesktop().run()
