# /set_device

The `/set_device` command is the command that stores the name of the device containing the dimensions you want. For
example, if you set a device name of `iPhone 8`, it will only generate screenings that are as tall as the iPhone 8 is.
The device is used in all screenings, including [`/generate_auto`](generate-auto.md)
and [`/generate_once`](generate-once.md).

The device name is case-sensitive and space-sensitive.

The default device size that everyone uses is "iPhone 11". In order to restore the default device size you will need to
use the `/set_device` command and set the device name to `iPhone 11`.

## Device List

The device list is sourced from
the [Puppeteer Device List](https://pptr.dev/#?product=Puppeteer&version=main&show=api-puppeteerdevices). To get the
latest device list, reference their documentation.

::: tip
If you would like to get the landscape version of a device, add the string ` landscape` to the end of the device name. 
For example, to get a landscape screenshot for an iPad Pro, you would provide `iPad Pro landscape`.
:::

* `Blackberry PlayBook`
* `BlackBerry Z30`
* `Galaxy Note 3`
* `Galaxy Note II`
* `Galaxy S III`
* `Galaxy S5`
* `Galaxy S8`
* `Galaxy S9+`
* `Galaxy Tab S4`
* `iPad`
* `iPad Mini`
* `iPad Pro`
* `iPhone 4`
* `iPhone 5`
* `iPhone 6`
* `iPhone 6 Plus`
* `iPhone 7`
* `iPhone 7 Plus`
* `iPhone 8`
* `iPhone 8 Plus`
* `iPhone SE`
* `iPhone X`
* `iPhone XR`
* `iPhone 11`
* `iPhone 11 Pro`
* `iPhone 11 Pro Max`
* `JioPhone 2`
* `Kindle Fire HDX`
* `LG Optimus L70`
* `Microsoft Lumia 550`
* `Microsoft Lumia 950`
* `Nexus 10`
* `Nexus 4`
* `Nexus 5`
* `Nexus 5X`
* `Nexus 6`
* `Nexus 6P`
* `Nexus 7`
* `Nokia Lumia 520`
* `Nokia N9`
* `Pixel 2`
* `Pixel 2 XL`
* `Pixel 3`
* `Pixel 4`

## Arguments

### device_name

The name of the device you want to use.

* Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
* Required: Yes
* Example: "iPhone 11"

