import { BigInt } from "@graphprotocol/graph-ts"
import {
  Transfer as TransferEvent,
} from "../generated/TalentProtocolToken/TalentProtocolToken"
import {
  Transfer,
  UserDateBalance,
  User
} from "../generated/schema"

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

  let fromUser = User.load(event.params.from.toHex())
  if (!fromUser) {
    fromUser = new User(event.params.from.toHex())
    fromUser.address = event.params.from
    fromUser.balance = BigInt.fromI32(0)
    fromUser.save()
  }

  let fromUserDateBalance = UserDateBalance.load(event.params.from.toHex())
  if (!fromUserDateBalance) {
    fromUserDateBalance = new UserDateBalance(event.params.from.toHex())
    fromUserDateBalance.user = fromUser.id
    fromUserDateBalance.date = event.block.timestamp
    fromUserDateBalance.oldBalance = fromUser.balance
    fromUserDateBalance.currentBalance = BigInt.fromI32(0)
    fromUserDateBalance.save()
  }

  // Ensure the user has enough balance before transferring
  if (fromUser.balance.ge(event.params.value)) {
    const balance = fromUser.balance.minus(event.params.value)
    fromUser.balance = balance
    fromUserDateBalance.currentBalance = balance
  } else {
    const balance = BigInt.fromI32(0)
    fromUser.balance = balance
    fromUserDateBalance.currentBalance = balance 
  }
  fromUser.save()

  let toUser = User.load(event.params.to.toHex())
  if (!toUser) {
    toUser = new User(event.params.to.toHex())
    toUser.address = event.params.to
    toUser.balance = BigInt.fromI32(0)
    toUser.save()
  }

  let toUserDateBalance = UserDateBalance.load(event.params.to.toHex())
  if (!toUserDateBalance) {
    toUserDateBalance = new UserDateBalance(event.params.to.toHex())
    toUserDateBalance.user = toUser.id
    toUserDateBalance.date = event.block.timestamp
    toUserDateBalance.oldBalance = toUser.balance
    toUserDateBalance.currentBalance = BigInt.fromI32(0)
    toUserDateBalance.save()
  }

  const balance = toUser.balance.plus(event.params.value)
  toUser.balance = balance
  toUserDateBalance.currentBalance = balance
  toUser.save()
  toUserDateBalance.save()
}
