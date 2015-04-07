Handlebars.registerHelper('each_with_sort', (array, key, opts) ->
    array = array.sort (a, b) ->
        a = a[key]
        b = b[key]
        return  1 if a > b
        return  0 if a == b
        return -1 if a < b
    s = ''
    for e in array
        s += opts.fn(e)
    s
)
