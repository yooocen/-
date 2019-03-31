#!/bin/bash
#Auto fix git merge/cherry-pick conflicts in files
# 作者 ： 陈涌达 c00428657
##################################变量########################################
clear
begin="------------------------欢迎使用本工具合并分支代码哦----------------------------"
end="----------------------------------结束-------------------------------------------"
fun1="1. 合并补丁或者开发分支"
fun2="2. 批量解决冲突"
fun3="3. 回退到合并前的版本"


##################################换行专用#####################################
white() {
echo
echo
echo
}

##################################合并代码流程##################################
mergeBranch() {
if [[ -e /tmp/branches ]]; then
		rm -f /tmp/branches
fi;
if [[ -e /tmp/branches ]]; then
		rm -f /tmp/logs
fi;

git branch -l > /tmp/branches

# 找到所有本地分支
echo "当前本地有以下的分支"
git branch -l 

# 询问需要合并哪个分支的代码
echo
echo "请问想要合并哪个分支的代码："
read choice 
if [[ $choice != '' ]];
then
	a=`grep -l -H -r $choice /tmp/branches`
	if [[ $a == '' ]]; then
		echo
		echo "不存在该分支, 可以先执行git check [分支名] origin/[分支名]试试"
		white
		echo $end
		exit  
	fi
fi;
``
# 合并该分支
git merge $choice > /tmp/logs
echo
echo "->合并完成, 开始解决冲突"
}



################################冲突解决流程##################################
conflictResolver() {

#Startup check
if [[ -e /tmp/conflicts ]]; then
		rm -f /tmp/conflicts
fi;

echo
echo "-> 开始检查当前目录下面的 .git 文件夹"

#Check for .git folder for behavior
if [[ -d ${PWD}/.git ]]; then

	echo "存在此目录, 使用 git diff 进行搜索"
	echo
	echo "-> 查找冲突中..."
	git diff --name-only --diff-filter=U > /tmp/conflicts

else 

	echo "不存在此目录, 使用原生工具进行搜索"
	echo
	echo "-> 查找冲突中..."
	grep -l -H -r '<<<<<<< HEAD' ${PWD}/* | awk '!a[$0]++' > /tmp/conflicts

fi;


#Check if conflicts exist
if [[ `cat /tmp/conflicts` != "" ]]; then
	echo 
	echo "在以下的文件中发现冲突 :"
	while read F  ; do
	        echo '- '$F
	done </tmp/conflicts
else
	echo "结束! 没有发现冲突 !"
	white
	echo $end
	exit
fi;

#Start executing standard conflict resolve strategy
echo 
echo "-> 正在解决冲突 ..."
echo
while read G  ; do
		echo "-> 当前正在处理: $G"
		# echo "Removing text between HEAD and middle"
        sed -i -s '/<<<<<<< HEAD/,/=======/d' $G
        # echo "Removing conflict footer"
		sed -i -s '/>>>>>>>/d' $G
		echo
done </tmp/conflicts

#Assume conflicts are actually solved
echo "->->->-> 冲突已经全部消除!"
echo
echo "请注意:"
echo "虽然大部分冲突可以这么修复，但是像文件路径改变导致的文件删除，新建的情况，还是需要手工处理"
echo "If you experience errors on compiling please review the changes made"
echo

#Stage commit?
if [[ -d ${PWD}/.git ]]; then
	echo "Would you like to stage the commit? () [Y/n]"
	echo -n ": "
	read choice
	if [[ $choice != "n" ]]; then
		git add .
		git commit
	fi


fi;
echo "All done!"
white
echo $end
}

#####################################回退#########################################
revertBranch() {
    git reset --hard origin/HEAD
    echo "回退完成!!"
    white
    echo $end
}


echo $begin
white
echo "请问需要使用哪种功能:(1/2/3)"
echo $fun1
echo $fun2
echo $fun3

read choice
if [[ $choice == '1' ]];
then 
	clear 
	echo $begin
	echo "当前正在使用功能: $fun1"
	white
	mergeBranch
	conflictResolver
elif [[ $choice == '2' ]]; 
then
    
	clear 
	echo $begin
	echo "当前正在使用功能: $fun2"
	white 
	conflictResolver
else 
    clear 
	echo $begin
	echo "当前正在使用功能: $fun3"
	white 
    revertBranch
fi
