> <font color ="purple" size="4">*本文主要讲各个进制转换的方法*<font>

@[TOC](进制转换)

---

# 前言

> 一些常用的`进制转换`  记录一下

---



# 🏝 一、说明
## 1. 作用
&emsp;&emsp;进制转换的作用是将不同进制的数字或数据进行相互转换，以便在不同的计算机系统、软件程序或应用程序中使用。例如，计算机内部的存储和处理都是基于二进制的，但是有些应用程序需要使用八进制或十六进制的数字来表示数据，因此需要进行进制转换。另外，在网络通信中，也经常需要进行进制转换，例如将十进制的IP地址转换为十六进制格式。
## 2. 本质
&emsp;&emsp;进制转换是指将一个数从一种进制转换为另一种进制的过程。说到底就是位值原理，任何进制中，每个数都可以按位权展开成各个数位上的数字乘以对应数位的位权，再相加的形式。在计算机科学中，进制转换是非常常见的操作，因为计算机内部的表示方式通常是使用二进制、八进制或十六进制的。
## 3. 方法
以下是一些进制转换的方法：
  1. 二进制转十进制：将二进制数每一位乘以2的相应次幂，然后将结果相加即可得到十进制数。例如，二进制数1010可以转换为十进制数8。

  2. 十进制转二进制：将十进制数不断除以2并取余数，直到商为0为止。将每次的余数倒序排列即可得到二进制数。例如，十进制数17可以转换为二进制数10001。

  3. 八进制转十进制：将八进制数每一位乘以8的相应次幂，然后将结果相加即可得到十进制数。例如，八进制数77可以转换为十进制数546。

  4. 十进制转八进制：将十进制数不断除以8并取余数，直到商为0为止。将每次的余数倒序排列即可得到八进制数。例如，十进制数17可以转换为八进制数15。

  5. 十六进制转十进制：将十六进制数每一位乘以16的相应次幂，然后将结果相加即可得到十进制数。例如，十六进制数A可以转换为十进制数10000H+A。

需要注意的是，在进行进制转换时，要确保原数字不会出现溢出的情况。如果出现溢出，需要进行相应的处理，例如截断或补零等操作。

## 4. 场景
进制转换的场景包括但不限于以下几个方面：

  1. 数据存储和处理：计算机内部的存储和处理都是基于二进制的，但是有些应用程序需要使用八进制或十六进制的数字来表示数据，因此需要进行进制转换。

  2. 网络通信：在网络通信中，经常需要将十进制的IP地址、端口号等转换为十六进制格式，以便在网络层进行传输。

  3. 图形图像处理：在图形图像处理中，经常需要将像素的颜色值从RGB(红绿蓝)模式转换为其他进制的表示方式，例如ARGB(Alpha-Red-Green-Blue)模式。

  4. 加密解密：在加密解密过程中，经常需要将明文转换为密文，或者将密文转换为明文，这就需要进行进制转换。

  5. 数据分析和统计：在数据分析和统计中，经常需要对不同进制的数值进行比较和计算，例如将一个十进制数转换为二进制数进行计算。
 
 <hr>
 
# 🏞 二、实例

## 1. 字符串与16进制的互转


```c
	/**
     * @Author @zzh
     * @Description // 将普通字符串转换为16进制字符串
     * @Date 09:41 2023/5/4 
     * @param str 普通字符串
     * @param lowerCase 转换后的字母为是否为小写  可不传默认为true
     * @param charset   编码格式  可不传默认为Charset.defaultCharset()
     * @return java.lang.String
     * @throws UnsupportedEncodingException
     **/
    public static String str2HexStr(String str, boolean lowerCase, String charset)
     	throws UnsupportedEncodingException {
        return Hex.encodeHexString(str.getBytes(charset), lowerCase);
    }

	/**
     * @Author @zzh
     * @Description //将16进制字符串转换为普通字符串
     * @Date 09:42 2023/5/4 
     * @param hexStr  16进制字符串
     * @param charset 编码格式 可不传默认为Charset.defaultCharset() 
     * @return java.lang.String
     * @throws DecoderException
     * @throws UnsupportedEncodingException
     **/
    public static String hexStr2Str(String hexStr, String charset) 
      throws DecoderException, 
    UnsupportedEncodingException, org.apache.commons.codec.DecoderException {
        byte[] bytes = Hex.decodeHex(hexStr);
        return new String(bytes, charset);
    }
```

## 2. 16进制字符串与byte数组互转
```c
	/**
     * @Author @zzh
     * @Description // 将16进制字符串转换为byte数组
     * @Date 10:22 2023/5/4 
     * @param hexItr 16进制字符串
     * @return byte[]
     **/
    public static byte[] hexItr2Arr(String hexItr) 
      throws DecoderException, org.apache.commons.codec.DecoderException {
        return Hex.decodeHex(hexItr);
    }

	/**
     * @Author @zzh
     * @Description // byte数组转化为16进制字符串
     * @Date 10:24 2023/5/4 
     * @param arr 数组
     * @param lowerCase 转换后的字母为是否为小写 可不传默认为true
     * @return java.lang.String
     **/
    public static String arr2HexStr(byte[] arr, boolean lowerCase) {
        return Hex.encodeHexString(arr, lowerCase);
    }
```
## 3. 字符串与指定格式的byte数组互转

```c
 	/**
     * @Author @zzh
     * @Description // 将普通字符串转换为指定格式的byte数组
     * @Date 10:33 2023/5/4 
     * @param str 普通字符串
     * @param charset 编码格式 可不传默认为Charset.defaultCharset()
     * @return byte[]
     * @throws UnsupportedEncodingException
     **/
    public static byte[] str2Arr(String str,String charset) throws UnsupportedEncodingException {
        return str.getBytes(charset);
    }

	/**
     * @Author @zzh
     * @Description // 将byte数组转换为指定编码格式的普通字符串
     * @Date 10:35 2023/5/4 
     * @param arr byte数组
     * @param charset 编码格式 可不传默认为Charset.defaultCharset()
     * @return java.lang.String
     * @throws UnsupportedEncodingException
     **/
    public static String arr2Str(byte[] arr,String charset)
     throws UnsupportedEncodingException {
        return new String(arr,charset);
    }
```
## 4. 字符串与16进制互转

```c
	/**
     * @Author @zzh
     * @Description // 16进制bety[]转换String字符串.方法一
     * @Date 10:46 2023/5/4
     * @param data
     * @return java.lang.String 返回字符串无空格
     **/
    public static String bytesToString(byte[] data) {
        char[] hexArray = "0123456789ABCDEF".toCharArray();
        char[] hexChars = new char[data.length * 2];
        for (int j = 0; j < data.length; j++) {
            int v = data[j] & 0xFF;
            hexChars[j * 2] = hexArray[v >>> 4];
            hexChars[j * 2 + 1] = hexArray[v & 0x0F];
        }
        String result = new String(hexChars);
        return result;
    }

	/**
     * @Author @zzh
     * @Description // String字符串转换16进制bety[].方法三
     * @Date 11:16 2023/5/4
     * @param str
     * @return byte[]
     **/
    public static byte[] stringToBytes3(String str) {
        if(str == null || str.trim().equals("")) {
            return new byte[0];
        }
        str = str.replace(" ", "");
        byte[] bytes = new byte[str.length() / 2];
        for(int i = 0; i < str.length() / 2; i++) {
            String subStr = str.substring(i * 2, i * 2 + 2);
            bytes[i] = (byte) Integer.parseInt(subStr, 16);
        }
        return bytes;
    }
    
```
## 5. 二进制与16进制互转

```c
	/**
     *
     * @Author @zzh
     * @Description // 16进制转二进制
     * @Date 14:32 2023/5/4
     * @param hex 16进制字符串
     * @return java.lang.String 二进制字符串
     **/
    public static String fromHexString(String hex) {
        if (StringUtils.isEmpty(hex) || hex.length() % 2 != 0) {
            return "";
        }
        StringBuilder binaryStr = new StringBuilder();
        String temp;
        for (int i = 0; i < hex.length(); i++) {
            temp = "0000" + Integer.toBinaryString(Integer.parseInt(hex.substring(i, i + 1), 16));
            binaryStr.append(temp.substring(temp.length() - 4));
        }
        return binaryStr.toString();
    }
	
	/**
     * 二进制转16进制
     * @Author @zzh
     * @Description // 二进制转16进制
     * @Date 14:40 2023/5/4
     * @param binary 二进制
     * @return java.lang.String 16进制字符串
     **/
    public static String toHexString(String binary) {
        if (StringUtils.isEmpty(binary) || binary.length() % 8 != 0) {
            return "";
        }
        StringBuilder hex = new StringBuilder();
        int tep;
        for (int i = 0; i < binary.length(); i += 4) {
            tep = 0;
            for (int j = 0; j < 4; j++) {
                tep += Integer.parseInt(binary.substring(i + j, i + j + 1)) << (4 - j - 1);
            }
            hex.append(Integer.toHexString(tep));
        }
        return hex.toString();
    }

```
## 6. 字节转其他

```c
	/**
     * @Author @zzh
     * @Description // byte转化为16进制字符串
     * @Date 10:39 2023/5/4
     * @param mByte 字节
     * @return java.lang.String
     **/
    public static String byteToHexString(byte mByte) {
        char[] Digit = { '0', '1', '2','3','4','5','6','7','8','9','A','B','C','D','E','F'};
        char[] arr = new char[2];
        arr[0] = Digit[(mByte>>>4)&0X0F];// ? >>>
        arr[1] = Digit[mByte&0X0F];
        String tmp = new String(arr);
        return tmp;
    }
	
	/**
     * @Author @zzh
     * @Description // 字节转换二进制数字字符串
     * @Date 17:02 2023/5/4
     * @param b
     * @return java.lang.String
     **/
    public static String getTwobinary(byte b) {
        String result = "";
        byte a = b;
        for (int i = 0; i < 8; i++) {
            byte c = a;
            a = (byte) (a >> 1);//每移一位如同将10进制数除以2并去掉余数。
            a = (byte) (a << 1);
            if (a == c) {
                result = "0" + result;
            } else {
                result = "1" + result;
            }
            a = (byte) (a >> 1);
        }
        return result;
    }
	
	/**
     * @Author @zzh
     * @Description // byte转为十进制int
     * @Date 16:42 2023/5/4
     * @param bytes
     * @return int
     **/
    public static int byte2int(byte bytes) {
        // 将byte转换为8位二进制字符串 依赖 commons-lang-x.x.jar包
        String binaryString = StringUtils.leftPad(Integer.toBinaryString(bytes & 0xff), 8, '0');
        // 将二进制字符串转换为十进制整数值
        int value = Integer.parseInt(binaryString, 2);
        return value;
    }
```
## 7. 16进制转其他
	

```c
	/**
     * @Author @zzh
     * @Description // 十六进制转十进制
     * @Date 17:00 2023/5/4
     * @param content
     * @return int
     **/
    public static int covert(String content) {
        int number = 0;
        String[] HighLetter = {"A", "B", "C", "D", "E", "F"};
        Map<String, Integer> map = new HashMap<>();
        for (int i = 0; i <= 9; i++) {
            map.put(i + "", i);
        }
        for (int j = 10; j < HighLetter.length + 10; j++) {
            map.put(HighLetter[j - 10], j);
        }
        String[] str = new String[content.length()];
        for (int i = 0; i < str.length; i++) {
            str[i] = content.substring(i, i + 1);
        }
        for (int i = 0; i < str.length; i++) {
            number += map.get(str[i]) * Math.pow(16, str.length - 1 - i);
        }
        return number;
    }
	
	/**
     * 十六进制转10进制 按位计算，位值乘权重
     * @Author @zzh
     * @Description // 十六进制转10进制
     * @Date 14:59 2023/5/4
     * @param hex
     * @return int
     **/
    public static int hexToDecimal(String hex) {
        int outcome = 0;
        for (int i = 0; i < hex.length(); i++) {
            char hexChar = hex.charAt(i);
            outcome = outcome * 16 + charToDecimal(hexChar);
        }
        return outcome;
    }
    
    /**
     * @Author @zzh
     * @Description // 16进制直接转换成为字符串(无需Unicode解码)
     * @Date 14:18 2023/5/4
     * @param hexStr
     * @return java.lang.String
     **/
    public static String hexStr2Str(String hexStr) {
        String str = "0123456789ABCDEF";
        char[] hexs = hexStr.toCharArray();
        byte[] bytes = new byte[hexStr.length() / 2];
        int n;
        for (int i = 0; i < bytes.length; i++) {
            n = str.indexOf(hexs[2 * i]) * 16;
            n += str.indexOf(hexs[2 * i + 1]);
            bytes[i] = (byte) (n & 0xff);
        }
        return new String(bytes);
    }

	/**
     * @Author @zzh
     * @Description // 将16进制字符串转换成汉字
     * @Date 13:58 2023/5/4
     * @param str
     * @return java.lang.String
     **/
    public static String deUnicode(String str) {
        byte[] bytes = new byte[str.length() / 2];
        byte tempByte = 0;
        byte tempHigh = 0;
        byte tempLow = 0;
        for (int i = 0, j = 0; i < str.length(); i += 2, j++) {
            tempByte = (byte) (((int) str.charAt(i)) & 0xff);
            if (tempByte >= 48 && tempByte <= 57) {
                tempHigh = (byte) ((tempByte - 48) << 4);
            } else if (tempByte >= 97 && tempByte <= 101) {
                tempHigh = (byte) ((tempByte - 97 + 10) << 4);
            }
            tempByte = (byte) (((int) str.charAt(i + 1)) & 0xff);
            if (tempByte >= 48 && tempByte <= 57) {
                tempLow = (byte) (tempByte - 48);
            } else if (tempByte >= 97 && tempByte <= 101) {
                tempLow = (byte) (tempByte - 97 + 10);
            }
            bytes[j] = (byte) (tempHigh | tempLow);
        }
        String result = null;
        try {
            result = new String(bytes, "GBK");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return result;
    }
```

## 8. 其他
	

```c
	/**
     * @Author @zzh
     * @Description // char进制转换
     * @Date 10:36 2023/5/4
     * @param c
     * @return byte
     **/
    private static byte charToByte(char c) {
        return (byte) "0123456789ABCDEF".indexOf(c);
    }

	/**
     * @Author @zzh
     * @Description // 将字符转化为数字
     * @Date 15:00 2023/5/4
     * @param c
     * @return int
     **/
    public static int charToDecimal(char c){
        if(c >= 'A' && c <= 'F')
            return 10 + c - 'A';
        else
            return c - '0';
    }
	
	
```

---



# 总结

> 完整代码及二进制算法见下篇：
➕[java进制转换工具类](https://blog.csdn.net/wodejiaAA/article/details/130500941?spm=1001.2014.3001.5502)
 > 	如果喜欢的话，欢迎 🤞关注 👍点赞 💬评论 🤝收藏  🙌一起讨论
> 		你的评价就是我✍️创作的动力！					  💞💞💞


