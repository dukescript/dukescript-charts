package net.java.html.charts;

/*
 * #%L
 * charts-api - a library from the "DukeScript" project.
 * %%
 * Copyright (C) 2015 Dukehoff GmbH
 * %%
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * #L%
 */

/** Represents a color.
 */
public final class Color {
    final String color;

    private Color(String color) {
        this.color = color;
    }

    /** Create color from its individual components.
     * 
     * @param red 0-255 value for red
     * @param green 0-255 value for green
     * @param blue 0-255 value for blue
     * @param alpha transparency from 0.0 to 1.0
     * @return object representing the color
     */
    public static Color rgba(int red, int green, int blue, double alpha) {
        rgbRange(red);
        rgbRange(green);
        rgbRange(blue);
        alphaRange(alpha);
        return new Color("rgba(" + red +"," + green + "," + blue + "," + alpha + ")");
    }

    /** Specify color as a string.
     * 
     * @param color string representing the color as used in HTML5 specification
     * @return color object
     */
    public static Color valueOf(String color) {
        return new Color(color);
    }

    @Override
    public String toString() {
        return color;
    }

    private static void alphaRange(double alpha) {
        if (alpha < 0.0 || alpha > 1.0) {
            throw new IllegalStateException("Alpha out of range: " + alpha);
        }
    }

    private static void rgbRange(int component) {
        if (component < 0 || component > 255) {
            throw new IllegalStateException("RGB component out of range: " + component);
        }
    }

}
