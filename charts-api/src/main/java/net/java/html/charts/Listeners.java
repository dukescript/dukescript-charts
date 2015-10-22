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

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

final class Listeners implements ChartListener {
    final ChartListener listener;
    final Listeners next;

    Listeners(ChartListener listener, Listeners next) {
        this.listener = listener;
        this.next = next;
    }

    @Override
    public void chartClick(ChartEvent ev) {
        assert false;
    }

    static ChartListener add(ChartListener current, ChartListener l) {
        return add(current, l, true);
    }
    static ChartListener add(ChartListener current, ChartListener l, boolean checkDuplicities) {
        if (l == null) {
            return current;
        }
        if (current == null) {
            return l;
        } else if (current instanceof Listeners) {
            if (checkDuplicities) {
                Listeners p = (Listeners) current;
                while (p != null) {
                    if (p.listener == l) {
                        return current;
                    }
                    p = p.next;
                }
            }
            return new Listeners(l, (Listeners)current);
        } else {
            if (current == l) {
                return current;
            }
            return new Listeners(l, new Listeners(current, null));
        }
    }

    static ChartListener remove(ChartListener current, ChartListener l) {
        if (current == null || current == l) {
            return null;
        }
        if (current instanceof Listeners) {
            Listeners head = (Listeners) current;
            if (head.listener == l) {
                return head.next;
            } else {
                final ChartListener tail = remove(head.next, l);
                if (tail == null) {
                    return head.listener;
                } if (tail instanceof Listeners) {
                    return new Listeners(head.listener, (Listeners) tail);
                } else {
                    return new Listeners(head.listener, new Listeners(tail, null));
                }
            }
        } else {
            return current;
        }
    }

    static List<ChartListener> all(ChartListener current) {
        if (current == null) {
            return Collections.emptyList();
        }
        if (current instanceof Listeners) {
            LinkedList<ChartListener> all = new LinkedList<>();
            Listeners l = (Listeners)current;
            while (l != null) {
                all.addFirst(l.listener);
                l = l.next;
            }
            return all;
        } else {
            return Collections.nCopies(1, current);
        }
    }
}
