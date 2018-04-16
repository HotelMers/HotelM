learningRate = 0.000001
result = 10000
index = 0
latestIndex = 0
while (1):
    sum = 0
    PreResult = 0
    for i in range(len(fuck)):
        sum += (learningRate * 93 + learningRate * 8376 * fuck[i][0] + learningRate * 6864.0 * fuck[i][1] + \
                learningRate * 8059.8 * fuck[i][2] + learningRate * 8501.8 * fuck[i][3] - shit[i])**2
    PreResult = (sum) / 10
    if (learningRate > 1):
        break
    
    if (PreResult < result):
        result = PreResult
        latestIndex = index
    learningRate += 0.000001
    index += 1