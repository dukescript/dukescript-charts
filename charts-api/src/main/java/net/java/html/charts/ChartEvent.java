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

import java.util.EventObject;

/** Event describing what happened in a {@link Chart}. Delivered to
 * {@link ChartListener} methods.
 */
public final class ChartEvent extends EventObject{
    private final Object[] info;

    ChartEvent(Chart source, Object[] info) {
        super(source);
        this.info = info;
    }

    /** Name of the object where the action happened.
     * @return name
     */
    public String getLabel() {
        return (String) info[0];
    }

    /** Values of the objects at a place where the action happened.
     * @return the array of values
     */
    public double[] getValues() {
        double[] arr = new double[info.length / 2];
        for (int i = 0; i < arr.length; i++) {
            arr[i] = ((Number) info[i * 2 + 1]).doubleValue();
        }
        return arr;
    }
}
