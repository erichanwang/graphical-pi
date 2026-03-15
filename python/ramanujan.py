#ramanujan summation for infinite pi
import math
def ramanujan_pi(n):
    sum = 0
    for k in range(n):
        sum += (math.factorial(4*k) * (1103 + 26390*k)) / ((math.factorial(k)**4) * (396**(4*k)))
    return (2*math.sqrt(2)/9801) * sum