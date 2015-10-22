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

import java.util.List;
import static org.testng.Assert.assertEquals;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class ListenersTest {
    private ChartListener current;
    private L l1;
    private L l2;
    private L l3;

    public ListenersTest() {
    }

    @BeforeMethod
    public void addFewItems() {
        current = null;
        l1 = new L("l1");
        assertEquals(Listeners.all(current).size(), 0, "Nothing");
        current = Listeners.add(current, l1);
        assertEquals(Listeners.all(current).size(), 1, "One item");
        l2 = new L("l2");
        current = Listeners.add(current, l2);
        assertEquals(Listeners.all(current).size(), 2, "Two items");
        l3 = new L("l3");
        current = Listeners.add(current, l3);
        assertEquals(Listeners.all(current).size(), 3, "Three items");

        current = Listeners.add(current, l1);
        assertEquals(Listeners.all(current).size(), 3, "Not added for the second time");
        current = Listeners.add(current, l3);
        assertEquals(Listeners.all(current).size(), 3, "Not added for the second time");
        current = Listeners.add(current, l2);
        assertEquals(Listeners.all(current).size(), 3, "Not added for the second time");

        current = Listeners.add(current, l2);
        assertEquals(Listeners.all(current).size(), 3, "Not added for the second time");

        current = Listeners.add(current, null);
        assertEquals(Listeners.all(current).size(), 3, "Null can't be added");
    }

    @Test
    public void testRemoveLast() {
        current = Listeners.remove(current, l3);
        List<ChartListener> arr = Listeners.all(current);
        assertEquals(arr.size(), 2, "just two");
        assertEquals(arr.get(0), l1);
        assertEquals(arr.get(1), l2);
    }

    @Test
    public void testRemoveSecond() {
        current = Listeners.remove(current, l2);
        List<ChartListener> arr = Listeners.all(current);
        assertEquals(arr.size(), 2, "just two");
        assertEquals(arr.get(0), l1);
        assertEquals(arr.get(1), l3);
    }

    @Test
    public void testRemoveFirst() {
        current = Listeners.remove(current, l1);
        List<ChartListener> arr = Listeners.all(current);
        assertEquals(arr.size(), 2, "just two");
        assertEquals(arr.get(0), l2, "l2: " + arr);
        assertEquals(arr.get(1), l3, "l3: " + arr);
    }

    @Test
    public void testRemoveTwo() {
        current = Listeners.remove(current, l1);
        current = Listeners.remove(current, l2);
        List<ChartListener> arr = Listeners.all(current);
        assertEquals(arr.size(), 1, "just one");
        assertEquals(arr.get(0), l3);
    }

    @Test
    public void testRemoveSecondTwo() {
        current = Listeners.remove(current, l2);
        current = Listeners.remove(current, l3);
        List<ChartListener> arr = Listeners.all(current);
        assertEquals(arr.size(), 1, "just one");
        assertEquals(arr.get(0), l1);
    }

    @Test
    public void testRemoveFirstLast() {
        current = Listeners.remove(current, l1);
        current = Listeners.remove(current, l3);
        List<ChartListener> arr = Listeners.all(current);
        assertEquals(arr.size(), 1, "just one");
        assertEquals(arr.get(0), l2);
    }

    @Test
    public void testRemoveAll() {
        current = Listeners.remove(current, l1);
        current = Listeners.remove(current, l3);
        current = Listeners.remove(current, l2);
        List<ChartListener> arr = Listeners.all(current);
        assertEquals(arr.size(), 0, "empty");

        current = Listeners.add(current, new L("l4"));
        arr = Listeners.all(current);
        assertEquals(arr.size(), 1, "one");
    }

    private static final class L implements ChartListener {
        private final String id;

        public L(String id) {
            this.id = id;
        }


        @Override
        public void chartClick(ChartEvent ev) {
        }

        @Override
        public String toString() {
            return "L[" + id + "]";
        }


    }
}
